import jwt from "jsonwebtoken";
import * as Yup from "yup";
import authConfig from "../../config/auth";
import User from "../models/User";
import File from "../models/File";

class SessionController {
  async store(req, res) {
    console.log(req.body);

    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validations fails" });
    }
    console.log(req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ 
      where: { email }, 
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url']
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const checkPass = await user.chckPassword(password);

    if (!checkPass) {
      return res.status(401).json({ error: "Password does not math" });
    }

    const { id, name, avatar, provider } = user;

    if (!avatar) {
      avatar = {
        url: 'https://i.pinimg.com/236x/91/aa/ef/91aaeffeaf6b29fe0a044568eea90be1.jpg'
      }
    }

    return res.json({
      user: {
        id,
        name,
        email,
        provider,
        avatar,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
