const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testPatch() {
  try {
    const formData = new FormData();
    // Create a dummy image
    fs.writeFileSync('dummy.jpg', 'fake image content');
    formData.append('image', fs.createReadStream('dummy.jpg'));

    const res = await axios.patch('http://localhost:3000/api/admin/workforce-solution/employer-hero/6a4e0f1ad3707696a31d6e57/image', formData, {
      headers: formData.getHeaders(),
    });

  } catch (err) {
    if (err.response) {
      console.error('Error Status:', err.response.status);
      console.error('Error Data:', err.response.data);
    } else {
      console.error(err);
    }
  }
}

testPatch();
