class UsersController < ApplicationController
  protect_from_forgery with: :null_session

  def show
    user = User
             .includes(:notifications)
             .find_by_endpoint(params[:endpoint])

    if user
      render json: { data: { user: user, notifications: user.notifications } }
    else
      head :not_found
    end
  end

  def create
    user = User.new(user_params)

    if user.save
      Initial.with(lang: :fi).deliver(user)

      render json: { data: { user: user, notifications: [] } }
    else
      head :bad_request
    end
  end

  def destroy
    user = User.find_by_endpoint(params[:endpoint])

    if user&.destroy
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
        :endpoint,
        :auth,
        :p256dh,
        :expiration_time
      )
    end
end
