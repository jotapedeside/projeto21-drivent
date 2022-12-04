import { prisma } from "@/config";

async function getBookings(userId: number) {
  return prisma.booking.findFirst({
    where: {
      User: {
        id: userId,
      }
    },
    include: {
      Room: true
    }
  });
}

async function getBookingById(bookingId: number) {
  return prisma.booking.findFirst({
    where: {
      id: bookingId
    }
  });
}

async function postBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId
    },
    include: {
      Room: true
    }
  });
}

async function putBooking(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      roomId
    },
    include: {
      Room: true
    }
  });
}

const bookingRepository = {
  getBookings,
  getBookingById,
  postBooking,
  putBooking
};

export default bookingRepository;
