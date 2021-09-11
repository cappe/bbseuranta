class CreateUsers < ActiveRecord::Migration[6.1]
  def self.up
    create_table :users, id: :uuid do |t|
      t.string :endpoint, null: false
      t.string :auth, null: false
      t.string :p256dh, null: false
      t.string :expiration_time

      t.timestamps
    end

    add_index :users, :endpoint, unique: true
  end

  def self.down
    drop_table :users
  end
end
