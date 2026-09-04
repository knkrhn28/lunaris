async function generateRandomNumbers(count = 10, min = 1, max = 4) {
  const url = `https://www.random.org/integers/?num=${count}&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain'
      }
    });

    if (!response.ok) {
      throw new Error(`Hata: ${response.status}`);
    }

    const text = await response.text();
    const numbers = text
      .trim()
      .split('\n')
      .map(n => parseInt(n, 10))
      .filter(n => !isNaN(n));

    return numbers;
  } catch (error) {
    console.error('Sayı üretilirken hata oluştu:', error);
    return null;
  }
}
