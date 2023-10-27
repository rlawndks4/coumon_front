import ManagerLayout from "src/layouts/manager/ManagerLayout";
import MainObjSetting from "src/views/manager/main_obj/setting";

const Main = () => {
  return (
    <>
     <MainObjSetting MAIN_OBJ_TYPE={'shop_obj'} />
    </>
  )
}
Main.getLayout = (page) => <ManagerLayout>{page}</ManagerLayout>;
export default Main;
