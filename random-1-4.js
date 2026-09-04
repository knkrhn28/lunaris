class RandomNumberStrategy {
  async generate(count, min, max) {
    throw new Error("generate() metodu implement edilmelidir.");
  }
}

class RandomOrgStrategy extends RandomNumberStrategy {
  async generate(count, min, max) {
    const url = `https://www.random.org/integers/?num=${count}&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'text/plain' }
    });

    if (!response.ok) {
      throw new Error(`API Hatası: ${response.status}`);
    }

    const text = await response.text();
    return this._parseResponse(text);
  }

  _parseResponse(text) {
    return text
      .trim()
      .split('\n')
      .map(n => parseInt(n, 10))
      .filter(n => !isNaN(n));
  }
}

class LocalRandomStrategy extends RandomNumberStrategy {
  async generate(count, min, max) {
    return Array.from({ length: count }, () => 
      Math.floor(Math.random() * (max - min + 1)) + min
    );
  }
}

class RandomNumberService {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  async getRandomNumbers(count = 10, min = 1, max = 4) {
    try {
      return await this.strategy.generate(count, min, max);
    } catch (error) {
      return null;
    }
  }
}

const randomService = new RandomNumberService(new RandomOrgStrategy());

async function generateRandomNumbers(count, min, max) {
  return await randomService.getRandomNumbers(count, min, max);
}
