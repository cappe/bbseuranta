class User < ApplicationRecord
  validates :endpoint,
            uniqueness: true,
            allow_nil: true

  validates :email,
            uniqueness: true,
            allow_nil: true

  has_many :notifications,
           -> { newest_first },
           as: :recipient
end
