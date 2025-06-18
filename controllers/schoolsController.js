import prisma from '../config/prisma.js';

const toRadians = degrees => (degrees * Math.PI) / 180;

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await prisma.school.create({
      data: {
        name,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    });
    res.status(201).json({ message: 'School added successfully' });
  } catch (error) {
    console.error('❌ Add School Error:', error);
    res.status(500).json({ message: 'Database error' });
  }
};

export const listSchools = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  try {
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);
    const schools = await prisma.school.findMany();

    const sortedSchools = schools
      .map(school => ({
        ...school,
        distance: getDistance(userLat, userLon, school.latitude, school.longitude),
      }))
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json(sortedSchools);
  } catch (error) {
    console.error('❌ List School Error:', error);
    res.status(500).json({ message: 'Database error' });
  }
};
