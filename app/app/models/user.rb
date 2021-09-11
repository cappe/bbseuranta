class User < ApplicationRecord
  validates :endpoint,
            presence: true,
            uniqueness: true

  has_many :notifications,
           -> { newest_first },
           as: :recipient
end
