import { Router } from './router'

type Route = {
  get: Router['get']
  post: Router['post']
  put: Router['put']
  patch: Router['patch']
  del: Router['delete']
}

export class Module {
  router

  constructor(init: (route: Route) => void) {
    const router = new Router()
    this.router = router

    init({
      get: router.get.bind(router),
      post: router.post.bind(router),
      put: router.put.bind(router),
      patch: router.patch.bind(router),
      del: router.delete.bind(router)
    })
  }
}
