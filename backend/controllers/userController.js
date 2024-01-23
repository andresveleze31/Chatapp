import filterObj from "../helpers/filterObject.js";
import User from "../models/User.js";

async function updateMe(req, res, next){

    const {user} = req;

    const filteredBody = filterObj(req.body, "firstName", "lastName", "about", "avatar")

    const updated_user = await User.findByIdAndUpdate(user._id, filteredBody, {new: true, validateModifiedOnly: true});

    res.status(200).json({
        status: "Success",
        data: updated_user,
        message: "Profile Updated Successfully"
    })

}

export {
    updateMe
}