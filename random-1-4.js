class RandomNumberStrategy {
  async generate(count, min, max) {
    throw new Error("generate() metodu implement edilmelidir.");
  }
}

class RandomOrgStrategy extends RandomNumberStrategy {
  async generate(count, min, max) {
    const url = `https://www.random.org/integers/?num=${count}&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;

    // Timeout ekleyerek mobil cihazlarda sonsuz beklemeyi önlüyoruz
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 saniye sonra iptal et

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'text/plain' },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

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
      // EĞER API HATASI ALINIRSA (Mobil engelleme, Timeout vb.)
      // Otomatik olarak Yerel Stratejiye geçiş yap ve tekrar dene
      if (this.strategy instanceof RandomOrgStrategy) {
        this.setStrategy(new LocalRandomStrategy());
        return await this.strategy.generate(count, min, max);
      }
      return null;
    }
  }
}

const randomService = new RandomNumberService(new RandomOrgStrategy());

async function generateRandomNumbers(count, min, max) {
  return await randomService.getRandomNumbers(count, min, max);
}
