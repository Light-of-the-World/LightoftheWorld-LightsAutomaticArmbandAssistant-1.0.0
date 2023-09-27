import { DependencyContainer } from "tsyringe";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import Config from "../config/config.json";

class Mod implements IPostDBLoadMod 
{
    public logger: ILogger;

    public postDBLoad(container: DependencyContainer): void 
    {
        // If the mod is not enabled end it
        if (!Config.ISENABLED) return;
        
        //#region variables and some initialization
        this.logger = container.resolve("WinstonLogger");
        const armbandColors: Record<string, string> = {
            blue: "5b3f3af486f774679e752c1f",
            green: "5b3f3b0186f774021a2afef7",
            red: "5b3f3ade86f7746b6b790d8e",
            white: "5b3f16c486f7747c327f55f7",
            yellow: "5b3f3b0e86f7746752107cda",
            purple: "5f9949d869e2777a0e779ba5"
        };
        let scavArmband: string;
        let raiderArmband: string;
        let rogueArmband: string;
        let usecArmband: string;
        let bearArmband: string;
        let bossArmband: string;
        let bloodhoundArmband:string;
        //#endregion

        //#region Checking for config proper config option, killing the mod if it's improper.
        switch (Config.SCAVARMBAND.toLowerCase()) 
        {
            case "blue":
            case "green":
            case "red":
            case "white":
            case "yellow":
            case "purple":
                scavArmband = armbandColors[Config.SCAVARMBAND];
                break;
            default:
                scavArmband = "";
                this.logger.warning(
                    "[FactionIdentifierArmbands] Error in config/config.json: No valid color for SCAVARMBAND, none will be used."
                );
                break;
        }
        switch (Config.RAIDERARMBAND.toLowerCase()) 
        {
            case "blue":
            case "green":
            case "red":
            case "white":
            case "yellow":
            case "purple":
                raiderArmband = armbandColors[Config.RAIDERARMBAND];
                break;
            default:
                raiderArmband = "";
                this.logger.warning(
                    "[FactionIdentifierArmbands] Error in config/config.json: No valid color for RAIDERARMBAND, none will be used."
                );
                break;
        }
        switch (Config.ROGUEARMBAND.toLowerCase()) 
        {
            case "blue":
            case "green":
            case "red":
            case "white":
            case "yellow":
            case "purple":
                rogueArmband = armbandColors[Config.ROGUEARMBAND];
                break;
            default:
                rogueArmband = "";
                this.logger.warning(
                    "[FactionIdentifierArmbands] Error in config/config.json: No valid color for ROGUEARMBAND, none will be used."
                );
                break;
        }
        switch (Config.USECARMBAND.toLowerCase()) 
        {
            case "blue":
            case "green":
            case "red":
            case "white":
            case "yellow":
            case "purple":
                usecArmband = armbandColors[Config.USECARMBAND];
                break;
            default:
                usecArmband = "";
                this.logger.warning(
                    "[FactionIdentifierArmbands] Error in config/config.json: No valid color for USECARMBAND, none will be used."
                );
                break;
        }
        switch (Config.BEARARMBAND.toLowerCase()) 
        {
            case "blue":
            case "green":
            case "red":
            case "white":
            case "yellow":
            case "purple":
                bearArmband = armbandColors[Config.BEARARMBAND];
                break;
            default:
                bearArmband = "";
                this.logger.warning(
                    "[FactionIdentifierArmbands] Error in config/config.json: No valid color for BEARARMBAND, none will be used."
                );
                break;
        }
        switch (Config.BOSSARMBAND.toLowerCase()) 
        {
            case "blue":
            case "green":
            case "red":
            case "white":
            case "yellow":
            case "purple":
                bossArmband = armbandColors[Config.BOSSARMBAND];
                break;
            default:
                bossArmband = "";
                this.logger.warning(
                    "[FactionIdentifierArmbands] Error in config/config.json: No valid color for BOSSARMBAND, none will be used."
                );
                break;
        }
        switch (Config.BLOODHOUNDARMBAND.toLowerCase()) 
        {
            case "blue":
            case "green":
            case "red":
            case "white":
            case "yellow":
            case "purple":
                bloodhoundArmband = armbandColors[Config.BLOODHOUNDARMBAND];
                break;
            default:
                bloodhoundArmband = "";
                this.logger.warning(
                    "[FactionIdentifierArmbands] Error in config/config.json: No valid color for BLOODHOUNDARMBAND, none will be used."
                );
                break;
        }
        //#endregion VALIDATION

        // Get all the bots and add armbands to them
        /* all the bot types here:
        BOSS: bossBully, bossGluhar, bossKilla, bossKojaniy, bossSanitar, bossTagilla, sectantPriest, bossKnight, bossZryachiy
        BOSS ESCORT: followerBully, followerKojaniy, followerSanitar, followerGluharSnipe, followerGluharAssault, followerGluharScout, followerGluharSecurity, sectantWarrior, followerBirdEye, followerBigPipe, followertagilla, followerzryachiy
        SCAV: assault, marksman, cursedAssault
        RAIDER: pmcBot, exUsec
        PMC BOT: assaultGroup, usec, bear
        */

        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");

        // Get all the in-memory json found in /assets/database
        const tables = databaseServer.getTables();
        if (Config.LOGGING.toLowerCase().match("basic") || Config.LOGGING.toLowerCase().match("verbose"))
            this.logger.logWithColor("[FactionIdentifierArmbands] Adding Armbands to bots...", LogTextColor.BLUE);
        let counter = 0;
        for (const botType in tables.bots.types) 
        {
            if (Config.LOGGING.toLowerCase().match("verbose"))
                this.logger.logWithColor(
                    "[FactionIdentifierArmbands] current botType is: " + botType,
                    LogTextColor.WHITE
                );
            const bot = tables.bots.types[botType];
            const equipmentArmband: Record<string, number> = {};
            this.logger.info(`${tables.bots.types.assault.chances.equipment["ArmBand"]}`);
            switch (botType) 
            {
                case "assault":
                case "marksman":
                case "cursedassault":
                    if (scavArmband) 
                    {
                        bot.chances.equipment.ArmBand = 100;
                        equipmentArmband[scavArmband] = 1;
                        bot.inventory.equipment.ArmBand = equipmentArmband;
                        if (Config.LOGGING.toLowerCase().match("verbose"))
                            this.logger.logWithColor(
                                "[FactionIdentifierArmbands] added " + Config.SCAVARMBAND + " to " + botType,
                                LogTextColor.GREEN
                            );
                        counter++;
                    }
                    break;
                case "pmcbot":
                    if (raiderArmband) 
                    {
                        bot.chances.equipment.ArmBand = 100;
                        equipmentArmband[raiderArmband] = 1;
                        bot.inventory.equipment.ArmBand = equipmentArmband;
                        if (Config.LOGGING.toLowerCase().match("verbose"))
                            this.logger.logWithColor(
                                "[FactionIdentifierArmbands] added " + Config.RAIDERARMBAND + " to " + botType,
                                LogTextColor.WHITE
                            );
                        counter++;
                    }
                    break;
                case "exusec":
                    if (rogueArmband) 
                    {
                        bot.chances.equipment.ArmBand = 100;
                        equipmentArmband[rogueArmband] = 1;
                        bot.inventory.equipment.ArmBand = equipmentArmband;
                        if (Config.LOGGING.toLowerCase().match("verbose"))
                            this.logger.logWithColor(
                                "[FactionIdentifierArmbands] added " + Config.ROGUEARMBAND + " to " + botType,
                                LogTextColor.WHITE
                            );
                        counter++;
                    }
                    break;
                case "assaultgroup":
                case "usec":
                    if (usecArmband)
                    {
                        bot.chances.equipment.ArmBand = 100;
                        equipmentArmband[usecArmband] = 1;
                        bot.inventory.equipment.ArmBand = equipmentArmband;
                        if (Config.LOGGING.toLowerCase().match("verbose"))
                            this.logger.logWithColor(
                                "[FactionIdentifierArmbands] added " + Config.USECARMBAND + " to " + botType,
                                LogTextColor.BLUE
                            );
                        counter++;
                    }
                    break;
                case "bear":
                    if (bearArmband) 
                    {
                        bot.chances.equipment.ArmBand = 100;
                        equipmentArmband[bearArmband] = 1;
                        bot.inventory.equipment.ArmBand = equipmentArmband;
                        if (Config.LOGGING.toLowerCase().match("verbose"))
                            this.logger.logWithColor(
                                "[FactionIdentifierArmbands] added " + Config.BEARARMBAND + " to " + botType,
                                LogTextColor.RED
                            );
                        counter++;
                    }
                    break;
                case "arenafighter":
                    if (bloodhoundArmband)
                    {
                        bot.chances.equipment.ArmBand = 100;
                        equipmentArmband[bloodhoundArmband] = 1;
                        bot.inventory.equipment.ArmBand = equipmentArmband;
                        if (Config.LOGGING.toLowerCase().match("verbose")) 
                            this.logger.logWithColor(
                                "[FactionIdentifierArmbands] added " + Config.BLOODHOUNDARMBAND + " to " + botType, 
                                LogTextColor.YELLOW
                            );
                        counter++;
                    }
                    break;
                case "bossbully":
                case "bossgluhar":
                case "bosskilla":
                case "bosskojaniy":
                case "bosssanitar":
                case "bosstagilla":
                case "bossknight":
                case "bossZryachiy":
                case "followerbigpipe":
                case "followerbirdeye":
                case "followerbully":
                case "followergluharassault":
                case "followergluharscout":
                case "followergluharsecurity":
                case "followergluharsnipe":
                case "followerkojaniy":
                case "followersanitar":
                case "followertagilla":
                case "followerzryachiy":
                case "sectantpriest":
                case "sectantwarrior":
                    if (bossArmband) 
                    {
                        bot.chances.equipment.ArmBand = 100;
                        equipmentArmband[bossArmband] = 1;
                        bot.inventory.equipment.ArmBand = equipmentArmband;
                        if (Config.LOGGING.toLowerCase().match("verbose"))
                            this.logger.logWithColor(
                                "[FactionIdentifierArmbands] added " + Config.BOSSARMBAND + " to " + botType,
                                LogTextColor.BLUE
                            );
                        counter++;
                    }
                    break;
            }
        }
        this.logger.info(`${tables.bots.types.assault.chances.equipment["ArmBand"]}`);
        if (Config.LOGGING.toLowerCase().match("basic") || Config.LOGGING.toLowerCase().match("verbose"))
            this.logger.logWithColor(
                "[FactionIdentifierArmbands] Finished adding Armbands to " + counter + " bot types.",
                LogTextColor.WHITE
            );

        if (Config.LOGGING.toLowerCase().match("verbose"))
            this.logger.logWithColor("[FactionIdentifierArmbands] finished with StaticRouter", LogTextColor.WHITE);
        
        
    }
}
module.exports = { mod: new Mod() };