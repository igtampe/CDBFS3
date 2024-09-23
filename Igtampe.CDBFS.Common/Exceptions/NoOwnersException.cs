namespace Igtampe.CDBFS.Common.Exceptions {
    public class NoOwnersException() : Exception("Cannot complete this operation, as this would leave this drive orphaned") {
    }
}
