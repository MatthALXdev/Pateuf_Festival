import fs from 'fs'

// Input JSON file path
const inputFilePath =
  'D:/MatthAlxDev/01_MSPR/pateuf-festival/public/data/schedule.json'
// Output NDJSON file path
const outputFilePath =
  'D:/MatthAlxDev/01_MSPR/pateuf-festival/public/data/schedule.ndjson'

// Read the input JSON file
fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading input JSON file:', err)
    return
  }

  try {
    // Parse the JSON data
    const jsonData = JSON.parse(data)

    // Ensure data is an array
    if (!Array.isArray(jsonData)) {
      throw new Error('Invalid JSON structure: expected an array')
    }

    // Transform each event into a Sanity-compatible format
    const ndjsonData = jsonData.map(event => {
      return {
        _type: 'schedule',
        id: event.id || 'Undefined Event',
        name: event.name || 'Unnamed Event',
        order: Number(event.order) || 0,
        duration: Number(event.duration) || 0,
        preptime: Number(event.preptime) || 0,
        location: event.location || 'Unknown Location',
        date: event.date || '',
        labels: event.labels || '',
        day: Number(event.day) || 0,
        start: event.start || '00:00',
        end: event.end || '00:00',
        description: event.description || '',
        image: event.image || '',
        logoURL: event.logoURL || '',
        backGroundActivity: Boolean(event.backGroundActivity),
      }
    })

    // Convert to NDJSON format (one JSON string per line)
    const ndjsonString = ndjsonData.map(item => JSON.stringify(item)).join('\n')

    // Write the NDJSON string to the output file
    fs.writeFile(outputFilePath, ndjsonString, 'utf8', writeErr => {
      if (writeErr) {
        console.error('Error writing NDJSON file:', writeErr)
        return
      }
      console.log('NDJSON file created successfully:', outputFilePath)
    })
  } catch (parseErr) {
    console.error('Error parsing JSON data:', parseErr)
  }
})
