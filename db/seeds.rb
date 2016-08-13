
CSV.open('./db/pokemon_names_with_type.csv').each do |row|
  s = Species.new(name: row[1])
  types = row[2].split(",").map{ |t| t.scan(/\w+/)[0]}
  types.each do |type|
    Type.create(name: type)
    s.types << Type.find_by(name: type)
  end
  s.save
end

CSV.open('./db/charge_moves.csv').each do |row|
  Move.create(name: row[0], move_type: 'charge_move')
end

CSV.open('./db/quick_moves.csv').each do |row|
  Move.create(name: row[0], move_type: 'quick_move')
end


#create user
u = User.create(username: 'test', email: "test@email.com")
# create user wish list for user 
u.user_wish_list = UserWishList.new 
u.user_wish_list.pokemons << Pokemon.create(species: Species.find(1))
u.user_wish_list.pokemons << Pokemon.create(species: Species.find(2))
u.save

#create a cart for user
u.cart = Cart.create
u.password = 'test'
u.save

u.pokemons.create(name:"Pikachu", cp: 100, species: Species.find_by(name: 'Pikachu'))
u.pokemons.create(name:"Wartortle", cp: 50, species: Species.find_by(name: 'Wartortle'))


10.times do 
  l =  Listing.new
  l.pokemon =  Pokemon.create(species: Species.find(rand(1..151)),cp: rand(1..2000),\
    quick_move: Move.where("move_type = 'quick_move'").sample, \
    charge_move: Move.where("move_type = 'charge_move'").sample)
  
  l.wishlist = Wishlist.create
  l.wishlist.pokemons << Pokemon.create(cp: rand(1..2000), species: Species.find_by(name: "Pikachu"),\
    quick_move: Move.where("move_type = 'quick_move'").sample, \
    charge_move: Move.where("move_type = 'charge_move'").sample)

  4.times do 
    l.wishlist.pokemons << Pokemon.create(species: Species.find(rand(1..151)),cp: rand(1..2000),\
    quick_move: Move.where("move_type = 'quick_move'").sample, \
    charge_move: Move.where("move_type = 'charge_move'").sample)
  end
  l.price = rand(500..3000)
  l.save
end


