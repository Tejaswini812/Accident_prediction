const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Property = require('./models/Property');
const Event = require('./models/Event');
const Accessory = require('./models/Accessory');
const Car = require('./models/Car');
const Package = require('./models/Package');
const Hotel = require('./models/Hotel');

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://villagecounty:StartupVillage2025@cluster0.mongodb.net/startup-village-county?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB for seeding'))
.catch(err => console.error('❌ MongoDB connection error:', err));

const seedData = async () => {
  try {
    console.log('🌱 Starting data seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    await Event.deleteMany({});
    await Accessory.deleteMany({});
    await Car.deleteMany({});
    await Package.deleteMany({});
    await Hotel.deleteMany({});

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        password: hashedPassword,
        address: {
          street: '123 Main Street',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          country: 'India'
        },
        governmentProof: {
          type: 'Aadhaar',
          number: '123456789012',
          document: 'no-document-uploaded'
        },
        isApproved: true
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '9876543211',
        password: hashedPassword,
        address: {
          street: '456 Park Avenue',
          city: 'Mysore',
          state: 'Karnataka',
          pincode: '570001',
          country: 'India'
        },
        governmentProof: {
          type: 'PAN',
          number: 'ABCDE1234F',
          document: 'no-document-uploaded'
        },
        isApproved: true
      }
    ]);

    console.log('✅ Users created:', users.length);

    // Create sample properties
    const properties = await Property.insertMany([
      {
        owner: users[0]._id,
        title: 'Luxury Villa in Coorg',
        description: 'Beautiful 3BHK villa with mountain view and modern amenities',
        type: 'Villa',
        location: {
          address: 'Coffee Estate Road, Madikeri',
          city: 'Coorg',
          state: 'Karnataka',
          pincode: '571201'
        },
        price: 11500000, // 1.15 crores
        area: 1500,
        bedrooms: 3,
        bathrooms: 2,
        amenities: ['Swimming Pool', 'Garden', 'Parking', 'Security'],
        images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        isApproved: true,
        contactInfo: {
          phone: '9876543210',
          email: 'john@example.com'
        }
      },
      {
        owner: users[1]._id,
        title: 'Modern Apartment in Bangalore',
        description: '2BHK apartment in prime location with all modern facilities',
        type: 'Apartment',
        location: {
          address: 'MG Road, Bangalore',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001'
        },
        price: 8500000, // 85 lakhs
        area: 1200,
        bedrooms: 2,
        bathrooms: 2,
        amenities: ['Lift', 'Parking', 'Security', 'Gym'],
        images: ['https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        isApproved: true,
        contactInfo: {
          phone: '9876543211',
          email: 'jane@example.com'
        }
      }
    ]);

    console.log('✅ Properties created:', properties.length);

    // Create sample events
    const events = await Event.insertMany([
      {
        organizer: users[0]._id,
        title: 'Coffee Plantation Tour',
        description: 'Experience the beauty of coffee plantations in Coorg with guided tour',
        category: 'Cultural',
        location: {
          venue: 'Coffee Estate, Coorg',
          address: 'Madikeri, Coorg',
          city: 'Coorg',
          state: 'Karnataka'
        },
        dateTime: {
          start: new Date('2024-12-15T09:00:00'),
          end: new Date('2024-12-15T17:00:00')
        },
        price: 1500,
        capacity: 20,
        images: ['https://images.unsplash.com/photo-1506905925346-14b1e3dba9b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        isApproved: true,
        contactInfo: {
          phone: '9876543210',
          email: 'john@example.com'
        }
      }
    ]);

    console.log('✅ Events created:', events.length);

    // Create sample accessories
    const accessories = await Accessory.insertMany([
      {
        name: 'Shakti Technology High Pressure Washer',
        price: '₹199',
        description: 'Best seller - High pressure car washer with accessories',
        image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        category: 'Automotive',
        seller: users[0]._id,
        stock: 10
      },
      {
        name: 'Shrida Naturals Lemon & Orange Air Freshener',
        price: '₹199',
        description: 'Fresh scent lasting up to 45 days, 60g net content',
        image: 'https://images.unsplash.com/photo-1603314585442-ee3b3c16fbcf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        category: 'Automotive',
        seller: users[1]._id,
        stock: 25
      }
    ]);

    console.log('✅ Accessories created:', accessories.length);

    // Create sample cars
    const cars = await Car.insertMany([
      {
        seller: users[0]._id,
        make: 'Honda',
        model: 'City',
        year: 2020,
        price: 850000,
        mileage: 25000,
        fuelType: 'Petrol',
        transmission: 'Manual',
        condition: 'Good',
        color: 'White',
        location: {
          address: 'MG Road, Bangalore',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001'
        },
        features: ['AC', 'Power Steering', 'Music System', 'Central Locking'],
        images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        description: 'Well maintained Honda City with single owner',
        isApproved: true,
        contactInfo: {
          phone: '9876543210',
          email: 'john@example.com'
        }
      }
    ]);

    console.log('✅ Cars created:', cars.length);

    // Create sample packages
    const packages = await Package.insertMany([
      {
        organizer: users[1]._id,
        title: 'Coorg Adventure Package',
        description: '3 days 2 nights adventure package in Coorg with trekking and sightseeing',
        type: 'Adventure',
        duration: {
          days: 3,
          nights: 2
        },
        price: 12000,
        originalPrice: 15000,
        discount: 20,
        location: {
          destination: 'Coorg',
          city: 'Coorg',
          state: 'Karnataka',
          country: 'India'
        },
        itinerary: [
          {
            day: 1,
            activities: ['Arrival', 'Local sightseeing', 'Coffee plantation visit'],
            meals: ['Lunch', 'Dinner'],
            accommodation: 'Resort'
          },
          {
            day: 2,
            activities: ['Trekking', 'Waterfalls visit', 'Local market'],
            meals: ['Breakfast', 'Lunch', 'Dinner'],
            accommodation: 'Resort'
          },
          {
            day: 3,
            activities: ['Departure'],
            meals: ['Breakfast']
          }
        ],
        inclusions: ['Accommodation', 'Meals', 'Transport', 'Guide'],
        exclusions: ['Personal expenses', 'Tips'],
        capacity: 15,
        images: ['https://images.unsplash.com/photo-1506905925346-14b1e3dba9b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        isApproved: true,
        contactInfo: {
          phone: '9876543211',
          email: 'jane@example.com'
        }
      }
    ]);

    console.log('✅ Packages created:', packages.length);

    // Create sample hotels
    const hotels = await Hotel.insertMany([
      {
        name: 'Sunset Retreat',
        location: 'Goa',
        type: 'Cottage',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=300&fit=crop',
        description: 'Beautiful beachside cottage with ocean view',
        amenities: ['WiFi', 'AC', 'Beach Access', 'Restaurant'],
        isApproved: true
      },
      {
        name: 'Ocean Breeze',
        location: 'Goa',
        type: 'Tent',
        price: 1500,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
        description: 'Luxury tent accommodation near the beach',
        amenities: ['WiFi', 'Beach Access', 'Campfire'],
        isApproved: true
      },
      {
        name: 'Mountain Escape',
        location: 'Coorg',
        type: 'Luxury Room',
        price: 5000,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
        description: 'Premium mountain view room with all amenities',
        amenities: ['WiFi', 'AC', 'Mountain View', 'Spa', 'Restaurant'],
        isApproved: true
      }
    ]);

    console.log('✅ Hotels created:', hotels.length);

    // Update users with their listings
    await User.findByIdAndUpdate(users[0]._id, {
      $push: { 
        properties: properties[0]._id,
        events: events[0]._id
      }
    });

    await User.findByIdAndUpdate(users[1]._id, {
      $push: { 
        properties: properties[1]._id,
        events: events[0]._id
      }
    });

    console.log('🎉 Data seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Properties: ${properties.length}`);
    console.log(`- Events: ${events.length}`);
    console.log(`- Accessories: ${accessories.length}`);
    console.log(`- Cars: ${cars.length}`);
    console.log(`- Packages: ${packages.length}`);
    console.log(`- Hotels: ${hotels.length}`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run seeding
seedData();
