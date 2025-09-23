export interface Batch {
  id: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  total_records: number;
  processed_records: number;
  results: EnrichedData[];
}

export interface EnrichedData {
  name: string;
  city: string;
  phone?: string;
  website?: string;
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}
