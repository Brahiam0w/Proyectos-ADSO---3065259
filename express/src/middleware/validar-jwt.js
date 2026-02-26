import jwt from "jsonwebtoken";

export const validarJWT = (req, res, next) => {

    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({
            msg: "No hay token en la petición"
        });
    }

    try {
        const token = authHeader.split(" ")[1];

        const { uid } = jwt.verify(
            token,
            process.env.SECRETORPRIVATEKEY
        );

        req.uid = uid;

        next();

    } catch (error) {
        return res.status(401).json({
            msg: "Token no válido"
        });
    }
};
