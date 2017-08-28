# multicloud-config-assistant

## Usage
```
npm install multicloud-config-assistant -g
```

```
Usage: multicloud config [options]

选项：
  -h, --help, --help    显示帮助信息                                      [布尔]
  --host                the host of the config service's database.
                                           [字符串] [必需] [默认值: "127.0.0.1"]
  --port                the port of the config service's database.
                                                       [字符串] [默认值: "3306"]
  --username            the user of the config service's database.
                                                                 [字符串] [必需]
  --password            the password of the config service's database.
                                                                 [字符串] [必需]
  --database            the name of the config service's database.
                                                     [字符串] [默认值: "config"]
  --services            the service id list. You can choose these.
                        [2] multi-cloud-service
                        [3] multi-cloud-user-service
                        [4] multi-cloud-vdc-service
                        [5] multi-cloud-content-service
                        [6] multi-cloud-schedule-service
                        [7] composer
                                                                 [字符串] [必需]
  --env, --environment  the env of the service's configuration.
                                                 [字符串] [默认值: "production"]
  --path                the path of the configuration files.            [字符串]

示例：
  multicloud config --host=127.0.0.1 --port=3306 --username=root
  --password=root --database=config --services=2,3 --path=/root/configs

Copyright Yanrong Tech 2017.
```

### Config Files

* multi-cloud-content-service.yml
* multi-cloud-schedule-service.yml
* multi-cloud-service.yml
* multi-cloud-user-service.yml
* multi-cloud-vdc-service.yml
* composer.yml
* application.yml

The application.yml is a global config file.
