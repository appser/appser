import config from 'core/config'
import { Snowflake } from 'nodejs-snowflake'

const snowflakeId = new Snowflake({
  custom_epoch: config.vendors.snowflakeId.customEpoch,
  instance_id: config.vendors.snowflakeId.instanceId
})

export const genSnowflakeId = () => snowflakeId.getUniqueID()
