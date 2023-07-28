<script>
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import { fetchAuthLogin } from "@api/index";
import {
  LOGIN_METHOD_MAP,
  DEVICE_TYPE_MAP,
  SOURCE_TYPE_MAP,
} from "@constant/login";
import { judgeIsCanJump } from "@utils/open-web-view";
import { getQueryValue } from "@utils/parse-url";
import { WX_APP_INFO } from "@constant/common";
export default {
  computed: {
    ...mapGetters({
      isTokenValid: "user/isTokenValid",
    }),
    ...mapState("user", {
      authLevel: (state) => {
        return state.userInfo.authLevel;
      },
    }),
  },

  data: {
    cacheSrc: "",
  },

  watch: {},

  onShow(option) {},

  onLaunch() {},

  onHide() {},

  methods: {
    ...mapActions({
      _getCurrentUserInfo: "app/getCurrentUserInfo",
    }),
    ...mapMutations({
      removeToken(commit) {
        commit("user/REMOVE_TOKEN");
      },
      setToken(commit, tokenInfo) {
        commit("user/SET_TOKEN", tokenInfo);
      },
      setUserInfo(commit, userInfo) {
        commit("user/SET_USER_INFO", userInfo);
      },
      setAppState(commit, info) {
        commit("app/UPDATE_APP_STATE", info);
      },
    }),
  },
};
</script>

<style lang="scss">
/*每个页面公共css */
@import "./style/index.css";

@import "@/uni_modules/uni-scss/index.scss";

@import "@/uni_modules/uview-ui/index.scss";

.example-info {
  font-size: 14px;
  color: #333;
  padding: 10px;
}
</style>
