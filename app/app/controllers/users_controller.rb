class UsersController < ApplicationController
  protect_from_forgery with: :null_session

  def show
    if current_user
      render json: { data: { user: current_user, notifications: current_user.notifications } }
    else
      head :not_found
    end
  end

  def create
    user = User.new(user_params)

    if user.save
      delivery_method = nil

      delivery_method = :webpush if user.endpoint
      delivery_method = :email if user.email

      Initial
        .with(
          lang: :fi,
          delivery_method: delivery_method
        )
        .deliver_later(user)

      render json: { data: { user: user, notifications: [] } }
    else
      head :bad_request
    end
  end

  def destroy
    if current_user&.destroy
      head :no_content
    else
      head :not_found
    end
  end

  def public_vapid_key
    vapid_key = Rails.application.credentials.dig(:vapid, :public)
    public_vapid_key_base_64 = Base64.urlsafe_decode64(vapid_key).bytes

    render json: public_vapid_key_base_64
  end

  private

    def user_params
      params.require(:user).permit(
        :email,
        :endpoint,
        :auth,
        :p256dh,
        :expiration_time
      )
    end

    def current_user
      @current_user ||= begin
                        user = User.includes(:notifications)

                        if params[:endpoint]
                          user = user.find_by_endpoint(params[:endpoint])
                        else
                          user = user.find_by_id(params[:id])
                        end

                        user
                      end
    end
end
