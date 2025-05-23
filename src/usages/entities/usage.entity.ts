export class Usage {
  id: string;
  driverId: string;
  vehicleId: string;
  reason: string;
  startDate: Date;
  endDate?: Date;
  data?: Usage;
}
