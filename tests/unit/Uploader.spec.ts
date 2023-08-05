import Uploader from "@/components/Uploader.vue";
import { VueWrapper, flushPromises, shallowMount } from "@vue/test-utils";
import axios from "axios";

const mockedAxios = axios as jest.Mocked<typeof axios>;

let wrapper: VueWrapper<any>;
const testFile = new File(["xyz"], "test.png", { type: "image/png" });

describe("Uploader Component", () => {
  beforeAll(() => {
    wrapper = shallowMount(Uploader, {
      props: {
        action: "test.url",
      },
    });
  });
  it("basic layout before uploading", () => {
    expect(wrapper.find("button").exists()).toBeTruthy();
    expect(wrapper.get("button").text()).toBe("点击上传");
    expect(wrapper.get("input").isVisible()).toBeFalsy();
  });

  it("upload process should works fine", async () => {
    const fileInput = wrapper.get("input").element as HTMLInputElement;
    const files = [testFile];

    Object.defineProperty(fileInput, "files", {
      value: files,
      writable: true,
    });
    mockedAxios.post.mockResolvedValueOnce({
      status: "success",
    });
    await wrapper.get("input").trigger("change");
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    expect(wrapper.get("button").text()).toBe("正在上传");
    await flushPromises();
    expect(wrapper.get("button").text()).toBe("上传成功");
  });

  it("should return error text when post is rejected", async () => {
    mockedAxios.post.mockRejectedValueOnce({
      error: "error",
    });
    await wrapper.get("input").trigger("change");
    expect(wrapper.get("button").text()).toBe("正在上传");
    expect(mockedAxios.post).toHaveBeenCalledTimes(2);
    await flushPromises();
    expect(wrapper.get("button").text()).toBe("上传失败");
    // expect(wrapper.findAll("li").length).toBe(2);
    // const lastItem = wrapper.get("li:last-child");
    // expect(lastItem.classes()).toContain("upload-error");
    // await wrapper.get(".delete-icon").trigger("click");
    // expect(wrapper.findAll("li").length).toBe(1);
  });
});
