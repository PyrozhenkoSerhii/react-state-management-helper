import * as React from "react";
import { Card, Statistic } from "antd";
import { LikeFilled, DislikeFilled } from "@ant-design/icons";

import { IBlog } from "../../interfaces/Blog";
import { TagComponent } from "./Tag";
import { shortenText } from "./utils";
import { TagsWrapper, HeaderWrapper } from "./styled";


const { Meta } = Card;

type TProps = {
  blog: IBlog
}

export const BlogItem = ({ blog }: TProps): JSX.Element => (
  <Card
    hoverable
    style={{ width: "33%" }}
    cover={<img alt="blog" src={`${blog.image}?random=${blog._id}`} />}
  >
    <HeaderWrapper>
      <TagsWrapper>
        {blog.tags.map((tag) => (
          <TagComponent tag={tag} key={tag} />
        ))}
      </TagsWrapper>
      <Statistic
        title="Rating"
        value={blog.rating}
        prefix={blog.rating > 0
          ? <LikeFilled style={{ color: "rgb(122, 216, 91)" }} />
          : <DislikeFilled style={{ color: "rgb(249, 147, 169)" }} />}
      />
    </HeaderWrapper>

    <Meta title={blog.title} description={shortenText(blog.content)} />
  </Card>
);
