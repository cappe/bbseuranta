class RemoveNullConstraints < ActiveRecord::Migration[6.1]
  def change
    change_column_null :users, :endpoint, true
    change_column_null :users, :auth, true
    change_column_null :users, :p256dh, true
  end
end
