class User < ActiveRecord::Base

    # users.password_hash in the database is a :string
  include BCrypt

  has_many :pokemons
  has_one :cart
  has_one :user_wish_list

  has_many :listings 

  before_create :add_wallet

  def add_wallet
    self.wallet = 0 
  end 

  def password
    @password ||= Password.new(password_hash)
  end

  def password=(new_password)
    @password = Password.create(new_password)
    self.password_hash = @password
  end

end