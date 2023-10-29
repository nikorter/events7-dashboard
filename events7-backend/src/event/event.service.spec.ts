import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventType } from './enums/EventType.enum';
import { NotFoundException } from '@nestjs/common';
import { UpdateEventDto } from './dto/update-event.dto';
import { HttpModule } from '@nestjs/axios';

describe('EventService', () => {
  let eventService: EventService;
  let eventRepository: Repository<Event>;

  const event = {
    id: 20,
    name: 'click-event',
    description:
      'when the user clicks the button the event should be triggered',
    type: EventType.APP,
    priority: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        EventService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    eventService = module.get<EventService>(EventService);
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  it('should be defined', () => {
    expect(eventService).toBeDefined();
  });

  describe('create', () => {
    it('should create an event', async () => {
      jest.spyOn(eventRepository, 'create').mockReturnValue(event);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(event);

      const result = await eventService.create(event);

      expect(result).toBe(event);
    });
  });

  describe('update', () => {
    it('should update an event', async () => {
      const eventId = 1;
      const updateEventDto: UpdateEventDto = {
        type: EventType.CROSSPROMO,
      };

      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(event);
      jest
        .spyOn(eventRepository, 'update')
        .mockResolvedValue({ affected: 1, raw: '', generatedMaps: [] });

      const result = await eventService.update(eventId, updateEventDto);

      expect(result).toEqual(event);
      expect(eventRepository.findOne).toHaveBeenCalledWith({
        where: { id: eventId },
      });
      expect(eventRepository.update).toHaveBeenCalledWith(
        eventId,
        updateEventDto,
      );
    });

    it('should throw NotFoundException if the event is not found', async () => {
      const eventId = 1;
      const updateEventDto: UpdateEventDto = {
        type: EventType.CROSSPROMO,
      };

      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(null);

      try {
        await eventService.update(eventId, updateEventDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`Event with id ${eventId} not found`);
        expect(eventRepository.findOne).toHaveBeenCalledWith({
          where: { id: eventId },
        });
        expect(eventRepository.update).not.toHaveBeenCalled();
      }
    });
  });

  describe('findAll', () => {
    it('should return an array of events', async () => {
      const events: Event[] = [event];

      jest.spyOn(eventRepository, 'find').mockResolvedValue(events);

      const result = await eventService.findAll();

      expect(result).toEqual(events);
      expect(eventRepository.find).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove an event', async () => {
      const eventId = 1;

      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(event);
      jest.spyOn(eventRepository, 'remove').mockResolvedValue(event);

      await eventService.remove(eventId);

      expect(eventRepository.findOne).toHaveBeenCalledWith({
        where: { id: eventId },
      });
      expect(eventRepository.remove).toHaveBeenCalledWith(event);
    });

    it('should throw NotFoundException if the event is not found', async () => {
      const eventId = 1;

      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(null);

      try {
        await eventService.remove(eventId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual(`Event with id ${eventId} not found`);
        expect(eventRepository.findOne).toHaveBeenCalledWith({
          where: { id: eventId },
        });
        expect(eventRepository.remove).not.toHaveBeenCalled();
      }
    });
  });
});
