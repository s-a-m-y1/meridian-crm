import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../../modules/properties/property.entity';
import { Lead } from '../../modules/leads/lead.entity';

@Injectable()
export class PropertyMatchingService {
  private readonly logger = new Logger(PropertyMatchingService.name);

  constructor() {}

  async matchProperties(leadId: string, organizationId: string): Promise<any> {
    // This would query properties and score them against lead preferences
    // For now, return a mock response
    
    return {
      leadId,
      matches: [
        {
          propertyId: 'prop-1',
          matchScore: 92,
          reasons: ['Matches budget', 'Preferred location', 'Correct property type', 'Available for viewing'],
          property: {
            id: 'prop-1',
            name: 'Luxury Villa in Zamalek',
            category: 'VILLA',
            price: 8500000,
            bedrooms: 4,
            location: 'Zamalek, Cairo',
            status: 'AVAILABLE',
          },
        },
        {
          propertyId: 'prop-2',
          matchScore: 85,
          reasons: ['Close to budget', 'Preferred location', 'Correct property type'],
          property: {
            id: 'prop-2',
            name: 'Modern Apartment in Maadi',
            category: 'APARTMENT',
            price: 4200000,
            bedrooms: 3,
            location: 'Maadi, Cairo',
            status: 'AVAILABLE',
          },
        },
        {
          propertyId: 'prop-3',
          matchScore: 78,
          reasons: ['Within budget range', 'Preferred area', 'Good amenities'],
          property: {
            id: 'prop-3',
            name: 'Townhouse in New Cairo',
            category: 'TOWNHOUSE',
            price: 5800000,
            bedrooms: 3,
            location: 'New Cairo',
            status: 'AVAILABLE',
          },
        },
      ],
    };
  }
}