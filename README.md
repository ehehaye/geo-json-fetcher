# geo-json-fetcher

基于阿里云的地理信息服务，获取国、省级的 GeoJson 数据

## 安装

```bash
git clone https://github.com/ehehaye/geo-json-fetcher.git
cd geo-json-fetcher
pnpm i
```

## 配置项

| 环境变量 | 默认值 | 描述 |
|----------|--------|------|
| BASE_URL | <https://geo.datav.aliyun.com/areas_v3/bound> | 数据源地址 |
| TOP_CODE | 100000 | 国家行政代码 |

## 示例

```bash
# 下载全国数据
pnpm pull

# 下载省级数据
pnpm pull:p

# 下载市级数据
pnpm pull:c
```

## 相关资料

- [DataV.GeoAtlas地理小工具系列](https://datav.aliyun.com/portal/school/atlas/area_selector)
- [前后端都要懂一点的 GIS](https://www.yuque.com/datav/datav-cool/swteb8)
