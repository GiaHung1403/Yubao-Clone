export const formatUsernameChat = ({dataUserSystem}) => {
    let username = dataUserSystem.EMP_NO;

    if (dataUserSystem.FST_NM) {
        username = `${username}.` + dataUserSystem.FST_NM.replace(/ /g, '.')
    }

    if (dataUserSystem.LST_NM) {
        username = `${username}.` + dataUserSystem.LST_NM
            .replace(/ /g, '.')
            .substr(0,
                dataUserSystem.LST_NM.indexOf('(') > -1 ? dataUserSystem.LST_NM.indexOf('(') - 1 : undefined)
    }

    return username;
};
