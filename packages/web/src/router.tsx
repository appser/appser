import { Route, createBrowserRouter, createRoutesFromElements, redirect } from 'react-router-dom'

import { NotFound } from './components/errors/NotFound'
import { ErrorBoundary } from './error'
import Index, * as index from './routes/_index'
import Welcome, * as welcome from './routes/_welcome'
import Invite, * as invite from './routes/_welcome.invite'
import Login from './routes/_welcome.login'
import OrgCreate from './routes/_welcome.org.create'
import Signup from './routes/_welcome.signup'
import AppsId, * as appsId from './routes/apps.$appId'
import AppsIdDatasetId, * as appsIdDatasetId from './routes/apps.$appId.d.$datasetId'
import AppsIdViewsId, * as appsIdViewsId from './routes/apps.$appId.d.$datasetId.v.$viewId'
import Org, * as org from './routes/orgs'
import OrgId, * as orgId from './routes/orgs.$orgId'
import OrgIdApps, * as orgIdApps from './routes/orgs.$orgId.apps'
import OrgIdMembers, * as orgIdMembers from './routes/orgs.$orgId.members'
import OrgIdSettings from './routes/orgs.$orgId.settings'
import queryClient from './vendor/queryClient'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorBoundary />}>
      <Route element={<Welcome />} loader={welcome.loader(queryClient)}>
        <Route
          path="/login"
          element={<Login />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/invite"
          element={<Invite />}
          errorElement={<invite.ErrorBoundary />}
        />
        <Route path="/org">
          <Route path="create" element={<OrgCreate />} />
        </Route>
      </Route>
      <Route path="/" element={<Index />} loader={index.loader(queryClient)}>
        <Route index loader={() => redirect('orgs')} />
        <Route path="orgs" element={<Org />} loader={org.loader(queryClient)}>
          <Route
            path=":orgId"
            loader={orgId.loader(queryClient)}
            element={<OrgId />}
          >
            <Route
              path="apps"
              element={<OrgIdApps />}
              loader={orgIdApps.loader(queryClient)}
            />
            <Route path="members" element={<OrgIdMembers />} loader={orgIdMembers.loader(queryClient)} />
            <Route path="settings" element={<OrgIdSettings />} />
          </Route>
        </Route>
        <Route path="apps">
          <Route path=":appId" element={<AppsId />} loader={appsId.loader(queryClient)}>
            <Route path="d">
              <Route
                path=":datasetId"
                element={<AppsIdDatasetId />}
                loader={appsIdDatasetId.loader(queryClient)}
              >
                <Route
                  path="v"
                >
                  <Route
                    path=":viewId"
                    element={<AppsIdViewsId />}
                    loader={appsIdViewsId.loader(queryClient)}
                  />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="404" element={<NotFound />} />
      </Route>
    </Route>
  )
)

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose())
}

export default router
