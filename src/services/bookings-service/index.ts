import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import bookingRepository from "@/repositories/booking-repository";
import roomRepository from "@/repositories/room-repository";
import { notFoundError, forbiddenError } from "@/errors";

async function getBookings(userId: number) {
  const bookings = await bookingRepository.getBookings(userId);

  if(!bookings) throw notFoundError;

  const booking = {
    "id": bookings.id,
    "Room": bookings.Room
  };
  
  return booking;
}

async function postBooking(userId: number, roomId: number) {
  //checagens: ver se user PODE fazer reserva, se room existe, se room está disponível
  await checkIfUserCanBook(userId);
  await checkIfRoomIsAvailable(roomId);

  const booking = await bookingRepository.postBooking(userId, roomId);

  const newBooking = {
    bookingId: booking.id,
    Room: booking.Room
  };

  return newBooking;
}

async function putBooking(userId: number, bookingId: number, roomId: number) {
  const userBooking = await bookingRepository.getBookings(userId);
  if(!userBooking) throw notFoundError();
  await checkIfRoomIsAvailable(roomId);

  const booking = await bookingRepository.putBooking(bookingId, roomId);

  const newBooking = {
    "bookingId": booking.id,
    "Room": booking.Room
  };

  return newBooking;
}

async function checkIfUserCanBook(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if(!ticket) throw notFoundError();
  if(ticket.status !== "PAID" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel ) throw forbiddenError();
}

async function checkIfRoomIsAvailable(roomId: number) {
  const room = await roomRepository.getRoomById(roomId);
  if(!room) throw notFoundError();
  if(!room || room.capacity === room.Booking.length) throw forbiddenError();
}

const bookingService = {
  getBookings,
  postBooking,
  putBooking
};

export default bookingService;
