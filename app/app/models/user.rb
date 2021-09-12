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

  scope :cooldown, -> {
    where(
      'prev_sent_at <= ?',
      DateTime.now - 1.hour
    )
      .or(where(prev_sent_at: nil))
  }
end
