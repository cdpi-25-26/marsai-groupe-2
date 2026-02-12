// scripts/seed-db.js
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { fileURLToPath } from 'url';
import db from "../src/models/index.js";

dotenv.config({ path: "../.env" });

async function clearTables() {
  console.log('Clearing existing data...');
  
  // Define tables in correct order (respecting foreign key constraints)
  const tables = [
    'collaborators_movies',
    'movies_categories',
    'votes',
    'awards',
    'reservations',
    'collaborators',
    'movies',
    'events',
    'categories'
  ];

  try {
    // Disable foreign key checks
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Clear each table
    for (const table of tables) {
      try {
        await db.sequelize.query(`TRUNCATE TABLE \`${table}\``);
        console.log(`✓ Cleared ${table}`);
      } catch (error) {
        // If table doesn't exist or has issues, log and continue
        console.log(`⚠ Could not clear ${table}:`, error.message);
      }
    }

    // Re-enable foreign key checks
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
  } catch (error) {
    console.error('Error clearing tables:', error);
  }
}

async function seedData() {
  try {
    const { User, Category, Collaborator, Event, Movie, Award, Vote, Reservation, MoviesCategories, CollaboratorsMovies } = db;

    // 1. Seed users (keeping the admin user)
    console.log('\nSeeding users...');
    
    // Check if demo users already exist to avoid duplicates
    const existingDemoUsers = await User.findAll({
      where: {
        email: ['john@example.com', 'sarah@example.com', 'mike@example.com', 'emma@example.com']
      }
    });
    
    const existingEmails = existingDemoUsers.map(user => user.email);
    
    const users = [
      {
        first_name: 'John',
        last_name: 'Filmmaker',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
        phone: '555-0101',
        role: 'PRODUCER',
        job: 'DIRECTOR'
      },
      {
        first_name: 'Sarah',
        last_name: 'Critic',
        email: 'sarah@example.com',
        password: await bcrypt.hash('password123', 10),
        phone: '555-0102',
        role: 'JURY',
        job: 'OTHER'
      },
      {
        first_name: 'Mike',
        last_name: 'Producer',
        email: 'mike@example.com',
        password: await bcrypt.hash('password123', 10),
        phone: '555-0103',
        role: 'PRODUCER',
        job: 'PRODUCER'
      },
      {
        first_name: 'Emma',
        last_name: 'JuryMember',
        email: 'emma@example.com',
        password: await bcrypt.hash('password123', 10),
        phone: '555-0104',
        role: 'JURY',
        job: 'WRITER'
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      // Only create user if they don't already exist
      if (!existingEmails.includes(userData.email)) {
        const user = await User.create(userData);
        createdUsers.push(user);
        console.log(`✓ Created user: ${userData.email}`);
      } else {
        console.log(`⏭️ Skipping existing user: ${userData.email}`);
        // Find the existing user to use for relationships
        const existingUser = existingDemoUsers.find(u => u.email === userData.email);
        if (existingUser) {
          createdUsers.push(existingUser);
        }
      }
    }
    console.log(`✓ Total users available: ${createdUsers.length}`);

    // 2. Seed categories
    console.log('\nSeeding categories...');
    const categories = [
      { name: 'Animation' },
      { name: 'Documentary' },
      { name: 'Experimental' },
      { name: 'Narrative' },
      { name: 'AI-Generated' },
      { name: 'Short Film' },
      { name: 'Student Film' },
      { name: 'International' }
    ];

    const createdCategories = [];
    for (const categoryData of categories) {
      // Use findOrCreate to avoid duplicates
      const [category] = await Category.findOrCreate({
        where: { name: categoryData.name },
        defaults: categoryData
      });
      createdCategories.push(category);
    }
    console.log(`✓ Added/Found ${createdCategories.length} categories`);

    // 3. Seed collaborators
    console.log('\nSeeding collaborators...');
    const collaborators = [
      {
        first_name: 'Alex',
        last_name: 'Director',
        email: 'alex.director@example.com',
        job: 'Director'
      },
      {
        first_name: 'Maria',
        last_name: 'Animator',
        email: 'maria.animator@example.com',
        job: 'AI Animator'
      },
      {
        first_name: 'Kenji',
        last_name: 'Composer',
        email: 'kenji.composer@example.com',
        job: 'Music Composer'
      },
      {
        first_name: 'Lisa',
        last_name: 'Writer',
        email: 'lisa.writer@example.com',
        job: 'Screenwriter'
      },
      {
        first_name: 'Tom',
        last_name: 'Producer',
        email: 'tom.producer@example.com',
        job: 'Film Producer'
      },
      {
        first_name: 'Sophie',
        last_name: 'VFX',
        email: 'sophie.vfx@example.com',
        job: 'VFX Artist'
      }
    ];

    const createdCollaborators = [];
    for (const collabData of collaborators) {
      // Use findOrCreate to avoid duplicates
      const [collaborator] = await Collaborator.findOrCreate({
        where: { email: collabData.email },
        defaults: collabData
      });
      createdCollaborators.push(collaborator);
    }
    console.log(`✓ Added/Found ${createdCollaborators.length} collaborators`);

    // 4. Seed events
    console.log('\nSeeding events...');
    const events = [
      {
        name: 'Opening Night Gala',
        description: 'Celebration of AI cinema with red carpet',
        date: '2026-04-01T19:00:00.000Z',
        location: 'Main Theater, Paris'
      },
      {
        name: 'AI Film Workshop',
        description: 'Learn AI tools for filmmaking',
        date: '2026-04-02T14:00:00.000Z',
        location: 'Workshop Room A'
      },
      {
        name: 'Panel Discussion: Ethics of AI',
        description: 'Experts discuss AI in creative industries',
        date: '2026-04-03T16:00:00.000Z',
        location: 'Conference Hall'
      },
      {
        name: 'Awards Ceremony',
        description: 'MarsAI Festival Awards Night',
        date: '2026-04-05T20:00:00.000Z',
        location: 'Grand Ballroom'
      },
      {
        name: 'Networking Mixer',
        description: 'Meet filmmakers and AI experts',
        date: '2026-04-04T18:00:00.000Z',
        location: 'Festival Lounge'
      }
    ];

    const createdEvents = [];
    for (const eventData of events) {
      // Use findOrCreate to avoid duplicates
      const [event] = await Event.findOrCreate({
        where: { name: eventData.name, date: eventData.date },
        defaults: eventData
      });
      createdEvents.push(event);
    }
    console.log(`✓ Added/Found ${createdEvents.length} events`);

    // 5. Seed movies
    console.log('\nSeeding movies...');
    // First, get the admin user to use as fallback
    const adminUser = await User.findOne({ where: { role: 'ADMIN' } });
    
    const movies = [
      {
        title: 'Digital Dreams',
        description: 'An AI-generated exploration of consciousness',
        duration: 15,
        main_language: 'English',
        release_year: 2025,
        nationality: 'USA',
        selection_status: 'selected',
        id_user: createdUsers[0]?.id_user || adminUser?.id_user || 1,
        synopsis: 'In a future where AI achieves consciousness, a digital entity explores what it means to dream.',
        ai_tool: 'Midjourney, RunwayML'
      },
      {
        title: 'Neural Symphony',
        description: 'Music visualizer created with neural networks',
        duration: 12,
        main_language: 'No Dialogue',
        release_year: 2024,
        nationality: 'Germany',
        selection_status: 'finalist',
        id_user: createdUsers[0]?.id_user || adminUser?.id_user || 1,
        synopsis: 'Visual representation of neural networks creating music in real-time.',
        ai_tool: 'Stable Diffusion, DALL-E 3'
      },
      {
        title: 'Echoes of Mars',
        description: 'AI-assisted sci-fi short about Martian colonization',
        duration: 25,
        main_language: 'English',
        release_year: 2025,
        nationality: 'International',
        selection_status: 'selected',
        id_user: createdUsers[1]?.id_user || adminUser?.id_user || 1,
        synopsis: 'Colonists on Mars discover ancient AI that holds secrets about humanity\'s past.',
        ai_tool: 'ChatGPT-4, Kaiber'
      },
      {
        title: 'The Last Canvas',
        description: 'AI helps a painter overcome creative block',
        duration: 18,
        main_language: 'French',
        release_year: 2024,
        nationality: 'France',
        selection_status: 'to_discuss',
        id_user: createdUsers[1]?.id_user || adminUser?.id_user || 1,
        synopsis: 'An artist collaborates with AI to create her masterpiece.',
        ai_tool: 'Adobe Firefly, Stable Video'
      },
      {
        title: 'Binary Heartbeats',
        description: 'Documentary about AI and emotion',
        duration: 45,
        main_language: 'English',
        release_year: 2025,
        nationality: 'UK',
        selection_status: 'submitted',
        id_user: createdUsers[2]?.id_user || adminUser?.id_user || 1,
        synopsis: 'Exploring whether AI can truly understand and replicate human emotions.',
        ai_tool: 'Various AI Tools'
      },
      {
        title: 'Quantum Stories',
        description: 'Experimental film using quantum computing algorithms',
        duration: 22,
        main_language: 'Spanish',
        release_year: 2024,
        nationality: 'Spain',
        selection_status: 'refused',
        id_user: createdUsers[2]?.id_user || adminUser?.id_user || 1,
        synopsis: 'Narrative structure based on quantum superposition principles.',
        ai_tool: 'Custom AI Algorithms'
      },
      {
        title: 'Silicon Memories',
        description: 'AI-generated memories of a future world',
        duration: 30,
        main_language: 'Japanese',
        release_year: 2025,
        nationality: 'Japan',
        selection_status: 'selected',
        id_user: createdUsers[0]?.id_user || adminUser?.id_user || 1,
        synopsis: 'An AI reconstructs lost human memories from the 22nd century.',
        ai_tool: 'Sora, Pika Labs'
      }
    ];

    const createdMovies = [];
    for (const movieData of movies) {
      // Use findOrCreate to avoid duplicates
      const [movie] = await Movie.findOrCreate({
        where: { title: movieData.title },
        defaults: movieData
      });
      createdMovies.push(movie);
    }
    console.log(`✓ Added/Found ${createdMovies.length} movies`);

    // 6. Seed awards
    console.log('\nSeeding awards...');
    const awards = [
      { id_movie: createdMovies[0].id_movie, award_name: 'Best AI Animation' },
      { id_movie: createdMovies[1].id_movie, award_name: 'Experimental Film Award' },
      { id_movie: createdMovies[2].id_movie, award_name: 'Audience Choice Award' },
      { id_movie: createdMovies[3].id_movie, award_name: 'Best Screenplay (AI-Assisted)' },
      { id_movie: createdMovies[6].id_movie, award_name: 'Best Visual Effects' }
    ];

    let awardsCreated = 0;
    for (const awardData of awards) {
      // Check if award already exists for this movie
      const existingAward = await Award.findOne({
        where: { 
          id_movie: awardData.id_movie,
          award_name: awardData.award_name 
        }
      });
      
      if (!existingAward) {
        await Award.create(awardData);
        awardsCreated++;
      }
    }
    console.log(`✓ Added ${awardsCreated} awards (skipped ${awards.length - awardsCreated} existing)`);

    // 7. Seed votes
    console.log('\nSeeding votes...');
    const votes = [
      { id_film: createdMovies[0].id_movie, id_user: createdUsers[0].id_user, note: 8.5, commentaire: 'Excellent concept and execution' },
      { id_film: createdMovies[0].id_movie, id_user: createdUsers[2].id_user, note: 9.0, commentaire: 'Groundbreaking use of AI tools' },
      { id_film: createdMovies[1].id_movie, id_user: createdUsers[0].id_user, note: 7.5, commentaire: 'Beautiful visuals but lacks narrative' },
      { id_film: createdMovies[1].id_movie, id_user: createdUsers[3].id_user, note: 8.0, commentaire: 'Innovative approach to music visualization' },
      { id_film: createdMovies[2].id_movie, id_user: createdUsers[0].id_user, note: 9.5, commentaire: 'Best integration of AI in traditional storytelling' },
      { id_film: createdMovies[3].id_movie, id_user: createdUsers[2].id_user, note: 6.5, commentaire: 'Good idea but execution could be better' },
      { id_film: createdMovies[4].id_movie, id_user: createdUsers[0].id_user, note: 8.0, commentaire: 'Important documentary topic' },
      { id_film: createdMovies[6].id_movie, id_user: createdUsers[3].id_user, note: 9.0, commentaire: 'Visually stunning and emotionally resonant' }
    ];

    let votesCreated = 0;
    for (const voteData of votes) {
      // Check if vote already exists from this user for this movie
      const existingVote = await Vote.findOne({
        where: { 
          id_film: voteData.id_film,
          id_user: voteData.id_user 
        }
      });
      
      if (!existingVote) {
        await Vote.create(voteData);
        votesCreated++;
      }
    }
    console.log(`✓ Added ${votesCreated} votes (skipped ${votes.length - votesCreated} existing)`);

    // 8. Seed reservations
    console.log('\nSeeding reservations...');
    const reservations = [
      { id_event: createdEvents[0].id_event, first_name: 'Alice', last_name: 'Johnson', email: 'alice@example.com', number_seats: 2 },
      { id_event: createdEvents[0].id_event, first_name: 'Bob', last_name: 'Smith', email: 'bob@example.com', number_seats: 1 },
      { id_event: createdEvents[1].id_event, first_name: 'Charlie', last_name: 'Brown', email: 'charlie@example.com', number_seats: 3 },
      { id_event: createdEvents[2].id_event, first_name: 'Diana', last_name: 'Prince', email: 'diana@example.com', number_seats: 2 },
      { id_event: createdEvents[3].id_event, first_name: 'Edward', last_name: 'Norton', email: 'edward@example.com', number_seats: 4 },
      { id_event: createdEvents[4].id_event, first_name: 'Fiona', last_name: 'Apple', email: 'fiona@example.com', number_seats: 2 }
    ];

    let reservationsCreated = 0;
    for (const reservationData of reservations) {
      // Check if reservation already exists for this event with this email
      const existingReservation = await Reservation.findOne({
        where: { 
          id_event: reservationData.id_event,
          email: reservationData.email 
        }
      });
      
      if (!existingReservation) {
        await Reservation.create(reservationData);
        reservationsCreated++;
      }
    }
    console.log(`✓ Added ${reservationsCreated} reservations (skipped ${reservations.length - reservationsCreated} existing)`);

    // 9. Link movies to categories
    console.log('\nLinking movies to categories...');
    const movieCategories = [
      { id_movie: createdMovies[0].id_movie, id_categorie: createdCategories[0].id_categorie },
      { id_movie: createdMovies[0].id_movie, id_categorie: createdCategories[4].id_categorie },
      { id_movie: createdMovies[0].id_movie, id_categorie: createdCategories[5].id_categorie },
      
      { id_movie: createdMovies[1].id_movie, id_categorie: createdCategories[2].id_categorie },
      { id_movie: createdMovies[1].id_movie, id_categorie: createdCategories[4].id_categorie },
      { id_movie: createdMovies[1].id_movie, id_categorie: createdCategories[5].id_categorie },
      
      { id_movie: createdMovies[2].id_movie, id_categorie: createdCategories[3].id_categorie },
      { id_movie: createdMovies[2].id_movie, id_categorie: createdCategories[4].id_categorie },
      { id_movie: createdMovies[2].id_movie, id_categorie: createdCategories[7].id_categorie },
      
      { id_movie: createdMovies[3].id_movie, id_categorie: createdCategories[3].id_categorie },
      { id_movie: createdMovies[3].id_movie, id_categorie: createdCategories[4].id_categorie },
      { id_movie: createdMovies[3].id_movie, id_categorie: createdCategories[5].id_categorie },
      
      { id_movie: createdMovies[4].id_movie, id_categorie: createdCategories[1].id_categorie },
      { id_movie: createdMovies[4].id_movie, id_categorie: createdCategories[4].id_categorie },
      { id_movie: createdMovies[4].id_movie, id_categorie: createdCategories[7].id_categorie },
      
      { id_movie: createdMovies[5].id_movie, id_categorie: createdCategories[2].id_categorie },
      { id_movie: createdMovies[5].id_movie, id_categorie: createdCategories[4].id_categorie },
      { id_movie: createdMovies[5].id_movie, id_categorie: createdCategories[6].id_categorie },
      
      { id_movie: createdMovies[6].id_movie, id_categorie: createdCategories[0].id_categorie },
      { id_movie: createdMovies[6].id_movie, id_categorie: createdCategories[3].id_categorie },
      { id_movie: createdMovies[6].id_movie, id_categorie: createdCategories[4].id_categorie }
    ];

    let movieCategoriesCreated = 0;
    for (const mcData of movieCategories) {
      const existingLink = await MoviesCategories.findOne({
        where: { 
          id_movie: mcData.id_movie,
          id_categorie: mcData.id_categorie 
        }
      });
      
      if (!existingLink) {
        await MoviesCategories.create(mcData);
        movieCategoriesCreated++;
      }
    }
    console.log(`✓ Added ${movieCategoriesCreated} movie-category links (skipped ${movieCategories.length - movieCategoriesCreated} existing)`);

    // 10. Link collaborators to movies
    console.log('\nLinking collaborators to movies...');
    const collaboratorMovies = [
      { id_collaborator: createdCollaborators[0].id_collaborator, id_movie: createdMovies[0].id_movie },
      { id_collaborator: createdCollaborators[1].id_collaborator, id_movie: createdMovies[0].id_movie },
      { id_collaborator: createdCollaborators[0].id_collaborator, id_movie: createdMovies[1].id_movie },
      { id_collaborator: createdCollaborators[2].id_collaborator, id_movie: createdMovies[1].id_movie },
      { id_collaborator: createdCollaborators[3].id_collaborator, id_movie: createdMovies[2].id_movie },
      { id_collaborator: createdCollaborators[4].id_collaborator, id_movie: createdMovies[2].id_movie },
      { id_collaborator: createdCollaborators[0].id_collaborator, id_movie: createdMovies[3].id_movie },
      { id_collaborator: createdCollaborators[3].id_collaborator, id_movie: createdMovies[3].id_movie },
      { id_collaborator: createdCollaborators[4].id_collaborator, id_movie: createdMovies[4].id_movie },
      { id_collaborator: createdCollaborators[5].id_collaborator, id_movie: createdMovies[4].id_movie },
      { id_collaborator: createdCollaborators[1].id_collaborator, id_movie: createdMovies[5].id_movie },
      { id_collaborator: createdCollaborators[2].id_collaborator, id_movie: createdMovies[5].id_movie },
      { id_collaborator: createdCollaborators[0].id_collaborator, id_movie: createdMovies[6].id_movie },
      { id_collaborator: createdCollaborators[1].id_collaborator, id_movie: createdMovies[6].id_movie },
      { id_collaborator: createdCollaborators[5].id_collaborator, id_movie: createdMovies[6].id_movie }
    ];

    let collaboratorMoviesCreated = 0;
    for (const cmData of collaboratorMovies) {
      const existingLink = await CollaboratorsMovies.findOne({
        where: { 
          id_collaborator: cmData.id_collaborator,
          id_movie: cmData.id_movie 
        }
      });
      
      if (!existingLink) {
        await CollaboratorsMovies.create(cmData);
        collaboratorMoviesCreated++;
      }
    }
    console.log(`✓ Added ${collaboratorMoviesCreated} collaborator-movie links (skipped ${collaboratorMovies.length - collaboratorMoviesCreated} existing)`);

    console.log('\n✅ Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

async function main() {
  try {
    // Clear existing data (except users)
    await clearTables();
    
    // Seed new data
    await seedData();
    
    console.log('\n🎉 All done! Database has been seeded.');
    console.log('\n📊 Summary:');
    console.log('  - Admin user preserved');
    console.log('  - Demo users added (if not already existing)');
    console.log('  - All other demo data created');
    console.log('\n🔑 Demo user credentials:');
    console.log('  Email: john@example.com / sarah@example.com / mike@example.com / emma@example.com');
    console.log('  Password: password123');
    
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await db.sequelize.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the seed script if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

// Export for use in other modules
export { seedData };