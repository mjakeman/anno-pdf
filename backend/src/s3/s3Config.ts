import AWS from 'aws-sdk';
import Config from "../util/Config";

AWS.config.accessKeyId = Config.AWS_ACCESS_KEY;
AWS.config.secretAccessKey = Config.AWS_SECRET_ACCESS_KEY;
const s3 = new AWS.S3();

export default s3;

