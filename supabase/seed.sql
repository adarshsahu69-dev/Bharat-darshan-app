-- Bharat Darshan seed data. Import into the Supabase SQL editor.
-- Generated from src/data/monuments.ts. Replace image_url with real
-- Supabase Storage paths once the bucket is populated.

BEGIN;

-- 34 monuments across 6 categories.

INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'amber-fort',
  'Amber Fort & Palace',
  'Rajasthan',
  'Jaipur',
  'Fort',
  ARRAY['forts','palaces','unesco'],
  '16th-century fortress on Cheel ka Teela with serpentine ramparts and mirror-inlaid royal chambers.',
  26.9858,
  75.8513,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Jaipur 03-2016 02 Amber Fort.jpg?width=800',
  100,
  '8:00 AM – 5:30 PM',
  4.9,
  '18.4k',
  true,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'jaigarh-fort',
  'Jaigarh Fort',
  'Rajasthan',
  'Jaipur',
  'Fort',
  ARRAY['forts'],
  'Hilltop fort guarding the Amber Fort, home to the world’s largest wheeled cannon, Jaivana.',
  27,
  75.8534,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Jaigarh Fort, Jaipur, 20191218 1554 9349.jpg?width=800',
  150,
  '9:00 AM – 5:00 PM',
  4.6,
  '8.1k',
  false,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'nahargarh-fort',
  'Nahargarh Fort',
  'Rajasthan',
  'Jaipur',
  'Fort',
  ARRAY['forts'],
  'Aravalli ridge fort with panoramic sunset views over the Pink City and its old ramparts.',
  26.9384,
  75.8156,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Nahargarh Fort, Jaipur, 20191218 1529 9314.jpg?width=800',
  50,
  '10:00 AM – 6:00 PM',
  4.5,
  '6.7k',
  false,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'chittorgarh-fort',
  'Chittorgarh Fort',
  'Rajasthan',
  'Chittorgarh',
  'Fort',
  ARRAY['forts','unesco'],
  'Largest fort in India, sprawling over a plateau with Vijay Stambha and ancient reservoirs.',
  24.8887,
  74.6442,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Jauhar Sthal in Chittorgarh Fort, Rajasthan, India.jpg?width=800',
  100,
  '9:00 AM – 5:30 PM',
  4.7,
  '12.3k',
  true,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'gwalior-fort',
  'Gwalior Fort',
  'Madhya Pradesh',
  'Gwalior',
  'Fort',
  ARRAY['forts'],
  'Ancient hill fort celebrated for its blue-tiled Man Singh Palace and Jain rock-cut sculptures.',
  26.185,
  78.1671,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Gwalior fort view 003 (15).jpg?width=800',
  75,
  '8:00 AM – 6:00 PM',
  4.6,
  '9.2k',
  false,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'kangra-fort',
  'Kangra Fort',
  'Himachal Pradesh',
  'Kangra',
  'Fort',
  ARRAY['forts'],
  'One of the oldest forts in the world, perched above the Banganga river gorge.',
  32.0994,
  76.2705,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Kangra Fort.jpg?width=800',
  25,
  '9:00 AM – 5:00 PM',
  4.4,
  '4.5k',
  false,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'brihadeeswara-temple',
  'Brihadeeswara Temple',
  'Tamil Nadu',
  'Thanjavur',
  'Temple',
  ARRAY['temples','unesco'],
  'Monolithic granite temple dedicated to Lord Shiva with an astronomical vimana and 16-foot Nandi.',
  10.7828,
  79.1318,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Brihadeeswara Temple-side view.jpg?width=800',
  0,
  '6:00 AM – 8:30 PM',
  4.9,
  '15.1k',
  true,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'khajuraho-temple',
  'Khajuraho Temples',
  'Madhya Pradesh',
  'Chhatarpur',
  'Temple',
  ARRAY['temples','unesco'],
  'Group of Nagara-style temples famed for intricate erotic and spiritual stone carvings.',
  24.8318,
  79.9199,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Khajuraho Dulhadeo 2010.jpg?width=800',
  250,
  '8:00 AM – 10:00 PM',
  4.8,
  '13.6k',
  true,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'konark-sun-temple',
  'Konark Sun Temple',
  'Odisha',
  'Konark',
  'Temple',
  ARRAY['temples','unesco'],
  '13th-century chariot-shaped temple to Surya, carved as an ornate stone-wheeled ratha.',
  19.8876,
  86.0944,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Sun Temple Main Structure, Konark, Orissa.jpg?width=800',
  40,
  '6:00 AM – 6:00 PM',
  4.7,
  '11.8k',
  true,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'meenakshi-temple',
  'Meenakshi Amman Temple',
  'Tamil Nadu',
  'Madurai',
  'Temple',
  ARRAY['temples'],
  'Vast temple complex with towering gopurams covered in thousands of colourful sculptures.',
  9.9195,
  78.1193,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Sri Meenakshi Devasthanam Temple (east-exposure).jpg?width=800',
  0,
  '5:00 AM – 10:00 PM',
  4.8,
  '21.2k',
  false,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'somnath-temple',
  'Somnath Temple',
  'Gujarat',
  'Somnath',
  'Temple',
  ARRAY['temples'],
  'First jyotirlinga shrine on the Arabian Sea coast, rebuilt many times through history.',
  20.888,
  70.4012,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Shree Somnath Temple.jpg?width=800',
  0,
  '6:00 AM – 9:00 PM',
  4.7,
  '9.9k',
  false,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'kashi-vishwanath',
  'Kashi Vishwanath Temple',
  'Uttar Pradesh',
  'Varanasi',
  'Temple',
  ARRAY['temples'],
  'One of the twelve jyotirlingas, set in the ancient ghats and lanes of Varanasi.',
  25.3109,
  83.0107,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Shri Kashi Vishwanath Temple 7.jpg?width=800',
  0,
  '2:30 AM – 11:00 PM',
  4.8,
  '18.5k',
  false,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'hawa-mahal',
  'Hawa Mahal',
  'Rajasthan',
  'Jaipur',
  'Palace',
  ARRAY['palaces'],
  'Five-storey honeycomb facade of 953 jharokhas built for the royal ladies to watch street life.',
  26.9239,
  75.8267,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Hawa Mahal 2011.jpg?width=800',
  50,
  '9:00 AM – 4:30 PM',
  4.7,
  '26.8k',
  false,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'city-palace-jaipur',
  'City Palace, Jaipur',
  'Rajasthan',
  'Jaipur',
  'Palace',
  ARRAY['palaces','museums'],
  'Grand royal residence with courtyards, museums and the ornate Chandra Mahal seven-storey tower.',
  26.9258,
  75.8237,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Jaipur 03-2016 20 City Palace complex.jpg?width=800',
  200,
  '9:30 AM – 5:00 PM',
  4.6,
  '14.3k',
  false,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'jal-mahal',
  'Jal Mahal',
  'Rajasthan',
  'Jaipur',
  'Palace',
  ARRAY['palaces'],
  'Rajput-style palace floating in the middle of the Man Sagar Lake, framed by the Nahargarh hills.',
  26.9536,
  75.8454,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Jaipur 03-2016 39 Jal Mahal - Water Palace.jpg?width=800',
  0,
  '6:00 AM – 6:00 PM',
  4.5,
  '10.6k',
  false,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'mysore-palace',
  'Mysore Palace',
  'Karnataka',
  'Mysuru',
  'Palace',
  ARRAY['palaces'],
  'Indo-Saracenic royal palace with gilded domes, stained glass and the golden Durbar Hall.',
  12.3068,
  76.6551,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Mysore Palace Morning.jpg?width=800',
  200,
  '10:00 AM – 5:30 PM',
  4.8,
  '22.4k',
  false,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'chandigarh-palace',
  'Morni Palace',
  'Haryana',
  'Panchkula',
  'Palace',
  ARRAY['palaces'],
  'Colonial-era hill palace overlooking the Morni hills, now a heritage resort.',
  30.8969,
  76.9997,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Jaipur 03-2016 39 Jal Mahal - Water Palace.jpg?width=800',
  0,
  'Open 24 hours',
  4.2,
  '1.9k',
  false,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'umaibhawan-palace',
  'Umaid Bhawan Palace',
  'Rajasthan',
  'Jodhpur',
  'Palace',
  ARRAY['palaces','museums'],
  'One of the world’s largest private residences, with a museum and lush palace gardens.',
  26.2425,
  73.0244,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Mysore Palace Morning.jpg?width=800',
  150,
  '9:00 AM – 5:00 PM',
  4.7,
  '8.7k',
  false,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'qutub-minar',
  'Qutub Minar',
  'Delhi',
  'New Delhi',
  'Fort',
  ARRAY['forts','unesco'],
  '73-metre fluted sandstone victory tower, the tallest brick minaret in the world.',
  28.5244,
  77.1855,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Qutb Minar 2011.jpg?width=800',
  550,
  '7:00 AM – 5:00 PM',
  4.8,
  '24.1k',
  true,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'taj-mahal',
  'Taj Mahal',
  'Uttar Pradesh',
  'Agra',
  'Palace',
  ARRAY['palaces','unesco'],
  'White marble mausoleum on the Yamuna, celebrated as the jewel of Mughal architecture.',
  27.1751,
  78.0421,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Taj Mahal, Agra, India edit2.jpg?width=800',
  1100,
  'Sunrise – Sunset (closed Fri)',
  4.9,
  '38.2k',
  true,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'stone-chariot',
  'Stone Chariot & Temples',
  'Karnataka',
  'Hampi',
  'Temple',
  ARRAY['temples','unesco'],
  'Ornate stone shrine dedicated to Garuda set amidst dramatic boulder hills and musical pillars.',
  15.335,
  76.46,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Stone Chariot at Hampi, Karnataka.jpg?width=800',
  40,
  '6:00 AM – 6:00 PM',
  4.8,
  '10.4k',
  true,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'sanchi-stupa',
  'Sanchi Stupa',
  'Madhya Pradesh',
  'Sanchi',
  'Temple',
  ARRAY['temples','unesco'],
  'Mauryan-era hemispherical stupa with intricately carved gateways depicting the life of the Buddha.',
  23.4795,
  77.7395,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Great Sanchi Stupa (3).jpg?width=800',
  250,
  '6:30 AM – 6:30 PM',
  4.7,
  '7.2k',
  true,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'red-fort',
  'Red Fort',
  'Delhi',
  'New Delhi',
  'Fort',
  ARRAY['forts','unesco'],
  'Massive sandstone fort-palace that was the seat of Mughal power for nearly 200 years.',
  28.6562,
  77.241,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Red Fort in Delhi 03-2016 img3.jpg?width=800',
  600,
  '9:30 AM – 4:30 PM (closed Mon)',
  4.5,
  '19.7k',
  true,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'national-museum',
  'National Museum',
  'Delhi',
  'New Delhi',
  'Museum',
  ARRAY['museums'],
  'Largest museum in India with over 200,000 works spanning 5,000 years of art and history.',
  28.6143,
  77.225,
  'https://commons.wikimedia.org/wiki/Special:FilePath/India national museum 01.jpg?width=800',
  0,
  '10:00 AM – 6:00 PM (closed Mon)',
  4.5,
  '5.4k',
  false,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'indian-museum',
  'Indian Museum',
  'West Bengal',
  'Kolkata',
  'Museum',
  ARRAY['museums'],
  'Founded in 1814, home to a celebrated Egyptian mummy, fossils and Indian art galleries.',
  22.5576,
  88.351,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Mumbai - Chhatrapati Shivaji Maharaj Vastu Sangrahalaya.jpg?width=800',
  50,
  '10:00 AM – 5:00 PM (closed Mon)',
  4.4,
  '4.1k',
  false,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'csmv-mumbai',
  'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya',
  'Maharashtra',
  'Mumbai',
  'Museum',
  ARRAY['museums'],
  'Indo-Saracenic museum with sculpture, miniature painting and natural history collections.',
  18.9269,
  72.8324,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Mumbai - Chhatrapati Shivaji Maharaj Vastu Sangrahalaya.jpg?width=800',
  150,
  '10:00 AM – 6:00 PM (closed Mon)',
  4.6,
  '8.3k',
  false,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'albert-hall',
  'Albert Hall Museum',
  'Rajasthan',
  'Jaipur',
  'Museum',
  ARRAY['museums'],
  'Oldest museum in Rajasthan, with an Egyptian mummy and a rich collection of Rajasthani art.',
  26.9107,
  75.8035,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Albert Hall (Museum).JPG?width=800',
  150,
  '9:00 AM – 5:00 PM',
  4.6,
  '9.6k',
  false,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'salar-jung',
  'Salar Jung Museum',
  'Telangana',
  'Hyderabad',
  'Museum',
  ARRAY['museums'],
  'One of India’s largest private collections, with the famous Veiled Rebecca marble statue.',
  17.3599,
  78.4489,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Courtyard of the Salar Jung Museum.jpg?width=800',
  50,
  '10:00 AM – 5:00 PM (closed Fri)',
  4.5,
  '6.8k',
  false,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'valley-of-flowers',
  'Valley of Flowers',
  'Uttarakhand',
  'Chamoli',
  'Nature',
  ARRAY['nature','unesco'],
  'Alpine valley carpeted with endemic wildflowers beneath the Nanda Devi and Nar Parvat peaks.',
  30.7281,
  79.6081,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Valley of flowers national park, Uttarakhand, India 03 (edit).jpg?width=800',
  150,
  '7:00 AM – 2:00 PM (Jun–Sep)',
  4.7,
  '5.2k',
  true,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'kaziranga',
  'Kaziranga National Park',
  'Assam',
  'Nagaon',
  'Nature',
  ARRAY['nature','unesco'],
  'Floodplain grassland famed for two-thirds of the world’s great one-horned rhinoceroses.',
  26.5774,
  93.2119,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Indian elephant in Kaziranga National Park March 2025 by Tisha Mukherjee 06.jpg?width=800',
  950,
  '6:30 AM – 4:00 PM',
  4.7,
  '7.8k',
  true,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'gir-national-park',
  'Gir National Park',
  'Gujarat',
  'Junagadh',
  'Nature',
  ARRAY['nature'],
  'The only natural home of the Asiatic lion, a dry deciduous forest and river ecosystem.',
  21.1245,
  70.8195,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Asiatic Lion Royal Walk at Gir National Park, Gujrat, India.jpg?width=800',
  1000,
  '6:00 AM – 12:00 PM / 3:00 PM – 6:00 PM',
  4.6,
  '4.9k',
  false,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'sundarbans',
  'Sundarbans National Park',
  'West Bengal',
  'South 24 Parganas',
  'Nature',
  ARRAY['nature','unesco'],
  'Largest mangrove forest on Earth and a Bengal tiger reserve threaded by tidal waterways.',
  21.9497,
  88.8978,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Sundarban Mudflats during low tide, Sundarban Tiger Reserve, West Bengal, India 02.jpg?width=800',
  500,
  '7:00 AM – 5:00 PM',
  4.5,
  '3.7k',
  true,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'western-ghats',
  'Western Ghats',
  'Maharashtra',
  'Pune',
  'Nature',
  ARRAY['nature','unesco'],
  'Ancient mountain chain with montane forests, waterfalls and an extraordinary range of endemic species.',
  18.5586,
  73.7433,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Landscapes of Western Ghats from Mullayyanagiri Betta.jpg?width=800',
  0,
  'Sunrise – Sunset',
  4.6,
  '6.4k',
  true,
);
INSERT INTO public.monuments (
  id, name, state, city, category, categories, description, lat, lng,
  image_url, ticket_inr, timings, rating, review_count, is_unesco
) VALUES (
  'radhanagar-beach',
  'Radhanagar Beach',
  'Andaman & Nicobar',
  'Havelock Island',
  'Nature',
  ARRAY['nature'],
  'Curving white-sand beach on Havelock Island, regularly ranked among Asia’s finest.',
  11.9761,
  93.0125,
  'https://commons.wikimedia.org/wiki/Special:FilePath/Radhanagar Beach in the Andaman Islands.jpg?width=800',
  0,
  'Sunrise – Sunset',
  4.8,
  '8.9k',
  false,
);

COMMIT;
