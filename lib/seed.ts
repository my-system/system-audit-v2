import type { Transaction, DetectionMethod } from "@/types";

// Deterministic PRNG (mulberry32) — same data every render
function createRNG(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NAMES = [
  "Andi Prasetyo", "Budi Santoso", "Citra Dewi", "Dewi Rahayu", "Eko Wijaya",
  "Fajar Nugroho", "Gita Permata", "Hendra Kurnia", "Indah Wulandari", "Joko Susilo",
  "Kartika Sari", "Lina Marlina", "Maman Suparman", "Nani Suryani", "Otto Firmansyah",
  "Putri Anggraeni", "Rahmat Hidayat", "Sari Indah", "Tono Hartono", "Umi Kalsum",
  "Vino Rangkuti", "Wahyu Setiawan", "Xena Puspita", "Yani Kusuma", "Zahra Amelia",
  "Ahmad Fauzi", "Bagas Prakosa", "Dian Permata", "Eka Putra", "Fitri Handayani",
  "Gunawan Wibowo", "Hesti Pratiwi", "Irfan Hakim", "Jihan Azzahra", "Kurniawan Adi",
  "Lestari Dewi", "Mulyadi Santoso", "Nurul Hidayah", "Oki Permana", "Puspita Sari",
  "Rina Wati", "Supriyadi", "Tuti Wulandari", "Umar Faruq", "Vera Lestari",
  "Wawan Setiadi", "Xander Putra", "Yuliana Sari", "Zulfikar Rizki", "Arief Rahman",
];

const LOCATIONS = [
  "Jakarta Selatan", "Jakarta Barat", "Jakarta Timur", "Jakarta Utara",
  "Surabaya", "Bandung", "Medan", "Semarang", "Yogyakarta", "Makassar",
  "Palembang", "Bali", "Malang", "Depok", "Tangerang",
];

const METHODS: DetectionMethod[] = ["z-score", "iqr", "isolation-forest", "circular", "cluster", "hybrid"];

// Suspicious user profiles — these will generate anomalous patterns
const CIRCULAR_CHAINS: number[][] = [[0, 1], [4, 25, 13], [17, 21, 5]];
const MIDNIGHT_USERS = [0, 25, 17]; // U001, U026, U018
const HIGH_VALUE_USERS = [0, 1, 17, 25, 13]; // Large amounts
const DORMANT_USERS = [0, 17, 25]; // Will have gaps then sudden activity

function pickUser(rng: () => number, exclude?: number): number {
  let idx: number;
  do { idx = Math.floor(rng() * NAMES.length); } while (idx === exclude);
  return idx;
}

function generateAmount(rng: () => number, isSuspicious: boolean): number {
  if (isSuspicious) {
    // 200M - 1B range for suspicious
    return Math.round((200_000_000 + rng() * 800_000_000) / 1_000_000) * 1_000_000;
  }
  // Normal distribution: mostly 1M-100M
  const tier = rng();
  if (tier < 0.5) return Math.round((1_000_000 + rng() * 9_000_000) / 500_000) * 500_000;
  if (tier < 0.85) return Math.round((10_000_000 + rng() * 40_000_000) / 1_000_000) * 1_000_000;
  return Math.round((50_000_000 + rng() * 150_000_000) / 5_000_000) * 5_000_000;
}

function getWeightedHour(rng: () => number, isSuspicious: boolean): number {
  if (isSuspicious && rng() < 0.3) {
    // 30% chance of midnight hours for suspicious users
    return Math.floor(rng() * 5); // 0-4
  }
  // Business hours weighted
  const r = rng();
  if (r < 0.6) return 8 + Math.floor(rng() * 12); // 8-19
  if (r < 0.85) return 20 + Math.floor(rng() * 3); // 20-22
  return Math.floor(rng() * 8); // 0-7
}

export const CURRENT_DATE = "2026-04-23";

export function generateSeedData(): Transaction[] {
  const rng = createRNG(42);
  const transactions: Transaction[] = [];
  const baseDate = new Date(CURRENT_DATE);

  // Phase 1: Generate normal transactions for 30 days
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - (29 - dayOffset));
    const dateStr = date.toISOString().split("T")[0];
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const dailyCount = isWeekend ? 28 + Math.floor(rng() * 12) : 38 + Math.floor(rng() * 22);

    for (let i = 0; i < dailyCount; i++) {
      const senderIdx = pickUser(rng);
      const receiverIdx = pickUser(rng, senderIdx);
      const isSuspicious = HIGH_VALUE_USERS.includes(senderIdx);
      const amount = generateAmount(rng, isSuspicious);
      const hour = getWeightedHour(rng, isSuspicious && MIDNIGHT_USERS.includes(senderIdx));
      const minute = Math.floor(rng() * 60);
      const second = Math.floor(rng() * 60);
      const location = LOCATIONS[Math.floor(rng() * LOCATIONS.length)];

      const senderId = `U${String(senderIdx + 1).padStart(3, "0")}`;
      const receiverId = `U${String(receiverIdx + 1).padStart(3, "0")}`;
      const timestamp = `${dateStr} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;

      transactions.push({
        id: `TX${String(transactions.length + 1).padStart(5, "0")}`,
        senderId,
        senderName: NAMES[senderIdx],
        receiverId,
        receiverName: NAMES[receiverIdx],
        amount,
        timestamp,
        location,
        riskScore: 0,
        riskLevel: "low",
        status: "clear",
        method: METHODS[Math.floor(rng() * METHODS.length)],
        zScore: 0,
        isFlagged: false,
        isCircular: false,
        isDormantReactivation: false,
        isVelocityAlert: false,
      });
    }
  }

  // Phase 2: Inject circular flow transactions (today only)
  const todayStr = CURRENT_DATE;
  const circularPatterns: { chain: number[]; amounts: number[]; startHour: number; interval: number }[] = [
    { chain: [0, 1], amounts: [450_000_000, 448_000_000], startHour: 9, interval: 30 },
    { chain: [4, 25, 13], amounts: [249_000_000, 198_000_000, 225_000_000], startHour: 9, interval: 45 },
    { chain: [17, 21, 5], amounts: [565_000_000, 189_000_000, 342_000_000], startHour: 2, interval: 35 },
  ];

  for (const pattern of circularPatterns) {
    let hour = pattern.startHour;
    let minute = 0;
    for (let i = 0; i < pattern.chain.length; i++) {
      const senderIdx = pattern.chain[i];
      const receiverIdx = pattern.chain[(i + 1) % pattern.chain.length];
      const senderId = `U${String(senderIdx + 1).padStart(3, "0")}`;
      const receiverId = `U${String(receiverIdx + 1).padStart(3, "0")}`;
      const ts = `${todayStr} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;

      transactions.push({
        id: `TX${String(transactions.length + 1).padStart(5, "0")}`,
        senderId,
        senderName: NAMES[senderIdx],
        receiverId,
        receiverName: NAMES[receiverIdx],
        amount: pattern.amounts[i],
        timestamp: ts,
        location: LOCATIONS[Math.floor(rng() * 5)], // Jakarta mostly
        riskScore: 0,
        riskLevel: "critical",
        status: "flagged",
        method: "circular",
        zScore: 0,
        isFlagged: true,
        isCircular: true,
        isDormantReactivation: false,
        isVelocityAlert: false,
      });

      minute += pattern.interval;
      if (minute >= 60) { hour += Math.floor(minute / 60); minute = minute % 60; }
    }
  }

  // Phase 3: Inject dormant reactivation transactions
  for (const userIdx of DORMANT_USERS) {
    const userId = `U${String(userIdx + 1).padStart(3, "0")}`;
    const receiverIdx = pickUser(rng, userIdx);
    const amount = generateAmount(rng, true);
    const hour = 1 + Math.floor(rng() * 4); // 1-4 AM
    const ts = `${todayStr} ${String(hour).padStart(2, "0")}:${String(Math.floor(rng() * 60)).padStart(2, "0")}:00`;

    transactions.push({
      id: `TX${String(transactions.length + 1).padStart(5, "0")}`,
      senderId: userId,
      senderName: NAMES[userIdx],
      receiverId: `U${String(receiverIdx + 1).padStart(3, "0")}`,
      receiverName: NAMES[receiverIdx],
      amount,
      timestamp: ts,
      location: LOCATIONS[Math.floor(rng() * 5)],
      riskScore: 0,
      riskLevel: "critical",
      status: "flagged",
      method: "hybrid",
      zScore: 0,
      isFlagged: true,
      isCircular: false,
      isDormantReactivation: true,
      isVelocityAlert: false,
    });
  }

  // Phase 4: Inject velocity fraud (multiple tx from same user in short time)
  const velocityUser = 25; // Ahmad Fauzi
  const velocitySenderId = `U${String(velocityUser + 1).padStart(3, "0")}`;
  for (let v = 0; v < 5; v++) {
    const receiverIdx = pickUser(rng, velocityUser);
    const ts = `${todayStr} 01:${String(40 + v * 3).padStart(2, "0")}:00`;
    transactions.push({
      id: `TX${String(transactions.length + 1).padStart(5, "0")}`,
      senderId: velocitySenderId,
      senderName: NAMES[velocityUser],
      receiverId: `U${String(receiverIdx + 1).padStart(3, "0")}`,
      receiverName: NAMES[receiverIdx],
      amount: Math.round((50_000_000 + rng() * 200_000_000) / 1_000_000) * 1_000_000,
      timestamp: ts,
      location: "Jakarta Timur",
      riskScore: 0,
      riskLevel: "high",
      status: "flagged",
      method: "cluster",
      zScore: 0,
      isFlagged: true,
      isCircular: false,
      isDormantReactivation: false,
      isVelocityAlert: true,
    });
  }

  // Sort by timestamp
  transactions.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  // Re-index IDs after sort
  transactions.forEach((tx, i) => {
    tx.id = `TX${String(i + 1).padStart(5, "0")}`;
  });

  return transactions;
}
