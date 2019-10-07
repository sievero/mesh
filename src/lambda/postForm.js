import axios from 'axios';

export async function handler(event) {
  try {
    const body = JSON.parse(event.body);

    const response = await axios.post(process.env.VUE_APP_WEBHOOK_URL, body);

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    };
  }
}
