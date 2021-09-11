class User < ApplicationRecord
  validates :endpoint,
            presence: true,
            uniqueness: true

  has_many :notifications, as: :recipient
end
