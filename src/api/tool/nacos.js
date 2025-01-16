import request from '@/utils/request'

export function getData(url) {
  return request({
    url: '/nacos/getData',
    method: 'post',
    data: {
      url
    }
  })
}
