class AddPrevSentAtToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :prev_sent_at, :datetime
  end
end
