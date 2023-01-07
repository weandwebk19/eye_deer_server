const groupService = require("./groupService");

class groupMiddleware{
    async isOwner(req, res, next){
        try{
            const groupId = req.body.groupId;
            const userId = req.user.id;
            const roleType = await groupService.getRole(groupId, userId);

            //is owner, next to controller
            if(roleType == 1){
                next();
                return;
            }

            //is not owner, return
            res.status(400).json({
                success: false,
                message: "User is not owner"
            })
        }
        catch(error){
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    }

    async isCoOwner(req, res, next){
        try{
            const groupId = req.body.groupId;
            const userId = req.user.id;

            const roleType = await groupService.getRole(groupId, userId);

            //is co-owner, next to controller
            if(roleType == 2){
                next();
                return;
            }

            //is not co-owner, return
            res.status(400).json({
                success: false,
                message: "User is not co-owner"
            })
        }
        catch(error){
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    }
}

module.exports = new groupMiddleware();