class User < ApplicationRecord
  validates :endpoint,
            presence: true,
            uniqueness: true
end
