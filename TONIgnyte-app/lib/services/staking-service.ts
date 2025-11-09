// lib/services/staking-service.ts
import { DatabaseService } from './database-service';

export interface StakingPool {
  id: string;
  name: string;
  description: string;
  rewardRate: number; // Annual percentage yield
  minStake: number; // Minimum amount to stake
  maxStake: number; // Maximum amount that can be staked in total
  totalStaked: number;
  isActive: boolean;
}

export interface StakingPosition {
  id: string;
  userId: number;
  poolId: string;
  amount: number;
  startTime: Date;
  endTime: Date | null; // null if still active
  rewardsEarned: number;
}

export class StakingService {
  // Get available staking pools
  static async getAvailablePools(): Promise<StakingPool[]> {
    // In a real implementation, this would query the database or smart contract
    // For now, we'll return mock data
    return [
      {
        id: 'pool1',
        name: 'Loyalty Token Staking',
        description: 'Stake your loyalty tokens to earn rewards',
        rewardRate: 12.5, // 12.5% APY
        minStake: 10,
        maxStake: 100000,
        totalStaked: 54200,
        isActive: true
      },
      {
        id: 'pool2',
        name: 'Premium Staking',
        description: 'High reward staking for premium members',
        rewardRate: 18.0, // 18% APY
        minStake: 100,
        maxStake: 50000,
        totalStaked: 12500,
        isActive: true
      }
    ];
  }

  // Get user's staking positions
  static async getUserPositions(userId: number): Promise<StakingPosition[]> {
    // In a real implementation, this would query the database
    // For now, we'll return mock data
    return [
      {
        id: 'pos1',
        userId,
        poolId: 'pool1',
        amount: 500,
        startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        endTime: null, // Still active
        rewardsEarned: 1.2
      }
    ];
  }

  // Stake tokens in a pool
  static async stakeTokens(userId: number, poolId: string, amount: number): Promise<StakingPosition> {
    // In a real implementation, this would interact with the staking smart contract
    // For now, we'll simulate the staking process
    
    // Verify user has enough tokens
    const userTokens = await DatabaseService.getLoyaltyTokensByUserId(userId);
    const totalTokens = userTokens.reduce((sum, token) => sum + token.tokenAmount, 0);
    
    if (totalTokens < amount) {
      throw new Error(`Insufficient tokens. Available: ${totalTokens}, Requested: ${amount}`);
    }
    
    // Create a new staking position
    const position: StakingPosition = {
      id: `stake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      poolId,
      amount,
      startTime: new Date(),
      endTime: null,
      rewardsEarned: 0
    };
    
    console.log(`User ${userId} staked ${amount} tokens in pool ${poolId}`);
    
    return position;
  }

  // Unstake tokens from a pool
  static async unstakeTokens(positionId: string): Promise<boolean> {
    // In a real implementation, this would interact with the staking smart contract
    // For now, we'll simulate the unstaking process
    
    console.log(`Unstaking position ${positionId}`);
    
    // In a real implementation, we would calculate rewards earned and transfer them to the user
    
    return true;
  }

  // Calculate rewards for a staking position
  static calculateRewards(position: StakingPosition, pool: StakingPool): number {
    const now = new Date();
    const timeStaked = (now.getTime() - position.startTime.getTime()) / (1000 * 60 * 60 * 24); // In days
    const annualRate = pool.rewardRate / 100;
    const dailyRate = annualRate / 365;
    
    // Calculate rewards based on amount staked and time
    const rewards = position.amount * dailyRate * timeStaked;
    
    return parseFloat(rewards.toFixed(2));
  }
}