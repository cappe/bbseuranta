class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
  self.implicit_order_column = 'created_at' # We are using UUID, hence we cannot sort by ID
end
