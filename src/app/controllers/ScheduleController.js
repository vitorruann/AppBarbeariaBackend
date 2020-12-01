import { endOfDay, parseISO, startOfDay } from "date-fns";
import { Op } from "sequelize";
import Appointment from "../models/Appointment";
import User from "../models/User";

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: "User is not a provider" });
    }

    const dateFormatIso = parseISO(req.query.date);
    const dataStart = startOfDay(dateFormatIso);
    const dataEnd = endOfDay(dateFormatIso);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: checkUserProvider.id,
        canceled_at: null,
        date: {
          [Op.between]: [dataStart, dataEnd],
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
      order: ["date"],
      attributes: ["id", "date", "user_id", "provider_id"],
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
