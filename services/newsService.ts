export interface NewsArticle {
  id: string;
  headline: string;
  content: string;
}

const sampleArticles: NewsArticle[] = [
  {
    id: 'article-1',
    headline: 'TechGiant Inc. Unveils New AI Chip, Stock Soars',
    content: `TechGiant Inc. (TGI) announced the release of its groundbreaking "QuantumCore" AI processor today, sending shockwaves through the tech industry. The company claims the new chip is 5 times faster than its leading competitor's model and consumes 40% less power. Analysts immediately upgraded TGI stock, with many predicting a significant Q4 revenue beat. The stock price jumped 15% in pre-market trading following the news. CEO Jane Doe called it "a new era for artificial intelligence," highlighting potential applications in autonomous driving and medical research.`
  },
  {
    id: 'article-2',
    headline: 'Global Supply Chain Woes Hit AutoMakers Group',
    content: `AutoMakers Group (AMG) has revised its annual production forecast downwards by 20%, citing ongoing semiconductor shortages and rising raw material costs. The announcement led to a sharp 8% drop in its stock value. The company's CFO, John Smith, stated in a press conference that "the current logistical challenges are unprecedented," and warned that consumer prices for new vehicles are likely to increase in the coming months. This news compounds a difficult year for the automotive sector, which has been struggling with post-pandemic recovery.`
  },
  {
    id: 'article-3',
    headline: 'Federal Reserve Signals Steady Interest Rates',
    content: `In a much-anticipated announcement, the Federal Reserve has decided to maintain current interest rates, citing stable inflation metrics and moderate economic growth. The decision was largely expected by the market, resulting in minimal fluctuation in major indices like the S&P 500 and Dow Jones. The Fed chair mentioned that they will "continue to monitor the economic landscape closely" but sees no immediate need for a rate hike. This provides a degree of certainty for investors, though concerns about future international trade policies remain.`
  },
];

export const getSampleArticles = (): NewsArticle[] => {
    return sampleArticles;
}
