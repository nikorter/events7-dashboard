/**
 * Service responsible for managing events in a NestJS application.
 */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class EventService {
  constructor(
    // Injecting the Event entity's repository for database operations
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Create a new event.
   * @param createEventDto - Data required to create the event.
   * @returns A promise that resolves to the created event.
   * @throws BadRequestException if event creation fails.
   */
  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id: createEventDto.id },
    });

    //check if event already exists
    if (event)
      throw new BadRequestException('Event with given id already exists');

    try {
      const event = this.eventsRepository.create(createEventDto);
      return this.eventsRepository.save(event);
    } catch (error) {
      throw new BadRequestException('Failed to create event');
    }
  }

  /**
   * Retrieve all events.
   * @returns A promise that resolves to an array of events.
   */
  async findAll(): Promise<Event[]> {
    return this.eventsRepository.find();
  }

  /**
   * Find an event by its ID.
   * @param id - The ID of the event to retrieve.
   * @returns A promise that resolves to the event with the specified ID.
   * @throws NotFoundException if the event with the given ID is not found.
   */
  async findOne(id: number): Promise<Event> {
    return this.findEventByIdOrFail(id);
  }

  /**
   * Update an existing event.
   * @param id - The ID of the event to update.
   * @param updateEventDto - Data containing the updates for the event.
   * @returns A promise that resolves to the updated event.
   * @throws NotFoundException if the event with the given ID is not found.
   */
  async update(id: number, updateEventDto: UpdateEventDto) {
    await this.findEventByIdOrFail(id);
    await this.eventsRepository.update(id, updateEventDto);
    return this.eventsRepository.findOne({ where: { id } });
  }

  /**
   * Remove (delete) an event.
   * @param id - The ID of the event to remove.
   * @throws NotFoundException if the event with the given ID is not found.
   */
  async remove(id: number) {
    const event = await this.findEventByIdOrFail(id);
    await this.eventsRepository.remove(event);
  }

  /**
   * Method to find an event by its ID and throw a NotFoundException if it doesn't exist.
   * @param id - The ID of the event to find.
   * @returns A promise that resolves to the event with the specified ID.
   * @throws NotFoundException if the event with the given ID is not found.
   */
  private async findEventByIdOrFail(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return event;
  }

  /**
   * It retrieves country code using the IP address and checks for permissions for given country code.
   *
   * @async
   * @param {string} ip - The IP address for which the country code will be determined.
   * @returns {Promise<boolean>} boolean indicating permission.
   *                            `true` for permission granted, `false` for denied permission.
   */
  async typeValidation(ip: string) {
    try {
      //this is just for test case beacuse if we run this on local host we
      //wont receive public ip but ::1 intead so we use server ip in this case

      //blank means it will use ip from where request is received
      const clientOrServerIp = ip === '::1' ? '' : ip;

      const ipApiResponse = await this.httpService.axiosRef.get(
        `http://ip-api.com/json/${clientOrServerIp}`,
      );

      const countryCode = ipApiResponse.data.countryCode;

      const o7Response = await this.httpService.axiosRef.get(
        `https://us-central1-o7tools.cloudfunctions.net/fun7-ad-partner?countryCode=${countryCode}`,
        {
          auth: {
            username: 'fun7user',
            password: 'fun7pass',
          },
        },
      );

      return { ads: o7Response.data.ads == 'sure, why not!' };
    } catch (error) {
      console.error('An error occurred:', error);
      return { ads: false };
    }
  }
}
