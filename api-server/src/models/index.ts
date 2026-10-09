export interface Station {
    id: number;
    name: string;
    brand: string;
    street: string;
    place: string;
    lat: number;
    lng: number;
    dist?: number;
    isOpen?: boolean;
}

export interface FuelPrice {
    id: number;
    brand: string;
    fuel_type: 'eurodiesel' | 'bmb95' | 'lpg' | 'bmb100';
    price_rsd: number;
    valid_from: Date;
    valid_to: Date | null;
    updated_at: Date;
}
