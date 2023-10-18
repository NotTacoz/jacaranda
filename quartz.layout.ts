import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { SimpleSlug } from "./quartz/util/path"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/NotTacoz/jacaranda",
    },
  }),
}


// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.RecentNotes({
      title: "Recent Notes",
        limit: 3,
        filter: (f) =>
          f.frontmatter?.date,
        linkToMore: "notes/" as SimpleSlug,
    })),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.DesktopOnly(
      Component.Explorer({
        mapFn: (node) => {
          // dont change name of root node
          if (node.depth > 0) {
            // set emoji for file/folder
            if (node.file) {
              node.displayName = "📄 " + node.displayName
            } else {
              node.displayName = "📁 " + node.displayName
            }
          }
        },
      })
    ),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.ArticleTitle()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.RecentNotes({
      title: "Recent Notes",
        limit: 3,
        filter: (f) =>
          f.frontmatter?.date,
        linkToMore: "notes/" as SimpleSlug,
    })),
  ],
  right: [],
}