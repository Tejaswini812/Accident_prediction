const mongoose = require('mongoose');
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
.then(() => console.log('✅ Connected to MongoDB for image updates'))
.catch(err => console.error('❌ MongoDB connection error:', err));

const updateImages = async () => {
  try {
    console.log('🔄 Starting image URL updates...');

    // Update Properties
    const propertyUpdates = await Property.updateMany(
      { 'images': { $regex: /unsplash\.com/ } },
      { 
        $set: { 
          'images.$[]': 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1000&h=600&fit=crop'
        }
      }
    );
    console.log(`✅ Updated ${propertyUpdates.modifiedCount} properties`);

    // Update Events
    const eventUpdates = await Event.updateMany(
      { 'images': { $regex: /unsplash\.com/ } },
      { 
        $set: { 
          'images.$[]': 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=1000&h=600&fit=crop'
        }
      }
    );
    console.log(`✅ Updated ${eventUpdates.modifiedCount} events`);

    // Update Accessories
    const accessoryUpdates = await Accessory.updateMany(
      { 'image': { $regex: /unsplash\.com/ } },
      { 
        $set: { 
          'image': 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=1000&h=600&fit=crop'
        }
      }
    );
    console.log(`✅ Updated ${accessoryUpdates.modifiedCount} accessories`);

    // Update Cars
    const carUpdates = await Car.updateMany(
      { 'images': { $regex: /unsplash\.com/ } },
      { 
        $set: { 
          'images.$[]': 'https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg?auto=compress&cs=tinysrgb&w=1000&h=600&fit=crop'
        }
      }
    );
    console.log(`✅ Updated ${carUpdates.modifiedCount} cars`);

    // Update Packages
    const packageUpdates = await Package.updateMany(
      { 'images': { $regex: /unsplash\.com/ } },
      { 
        $set: { 
          'images.$[]': 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=1000&h=600&fit=crop'
        }
      }
    );
    console.log(`✅ Updated ${packageUpdates.modifiedCount} packages`);

    // Update Hotels
    const hotelUpdates = await Hotel.updateMany(
      { 'image': { $regex: /unsplash\.com/ } },
      { 
        $set: { 
          'image': 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1000&h=600&fit=crop'
        }
      }
    );
    console.log(`✅ Updated ${hotelUpdates.modifiedCount} hotels`);

    console.log('🎉 Image URL updates completed successfully!');

  } catch (error) {
    console.error('❌ Error updating images:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run updates
updateImages();
